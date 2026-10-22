// extract-bloodwork
// Reads an uploaded blood report (photos or PDF) with Claude and stores each marker
// as a pending result for coach review. Coach-only.
//
// POST { "movement_screen_id": "<uuid>" }  -> creates a panel from that screen's "bloods" files
// POST { "panel_id": "<uuid>" }            -> re-runs extraction on an existing panel
// POST { "email": "...", "sex": "female", "files": [{ "path", "name", "type" }] } -> files already in audit-uploads
// Returns { panel_id, status: "extracting" } straight away; extraction finishes in the background.
//
// Needs the ANTHROPIC_API_KEY secret set in Supabase (Edge Functions -> Secrets).

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { encodeBase64 } from "jsr:@std/encoding@1/base64";

const MODEL = "claude-sonnet-5-5";
const BUCKET = "audit-uploads";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // API limit per image

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

type SourceFile = { kind?: string; name?: string; path: string; type?: string; size?: number };

const RECORD_TOOL = {
  name: "record_bloodwork",
  description: "Record every blood test result printed on the report.",
  input_schema: {
    type: "object",
    properties: {
      collected_on: { type: ["string", "null"], description: "Collection date as YYYY-MM-DD, or null if not shown" },
      lab_name: { type: ["string", "null"] },
      sex: { type: ["string", "null"], enum: ["male", "female", null], description: "Only if printed on the report" },
      notes: { type: ["string", "null"], description: "Anything unreadable, cut off or ambiguous" },
      results: {
        type: "array",
        items: {
          type: "object",
          properties: {
            raw_name: { type: "string", description: "Test name exactly as printed" },
            marker_key: { type: ["string", "null"], description: "Matching key from the provided marker list, or null if none matches" },
            value: { type: ["number", "null"], description: "Numeric value; null if not a plain number" },
            value_text: { type: "string", description: "Value exactly as printed, e.g. '4.2' or '<0.6'" },
            unit: { type: ["string", "null"], description: "Unit exactly as printed" },
            lab_low: { type: ["number", "null"] },
            lab_high: { type: ["number", "null"] },
            lab_range_text: { type: ["string", "null"], description: "Reference range exactly as printed" },
            lab_flag: { type: ["string", "null"], description: "H, L or other flag as printed" },
            confidence: { type: "string", enum: ["high", "medium", "low"] },
            source_file_index: { type: "integer", description: "0-based index of the image/page it came from" },
          },
          required: ["raw_name", "value_text", "confidence", "source_file_index"],
        },
      },
    },
    required: ["results"],
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) return json({ error: "ANTHROPIC_API_KEY secret is not set" }, 500);

  // Caller must be a coach
  const authHeader = req.headers.get("Authorization") ?? "";
  const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
  const { data: userData } = await userClient.auth.getUser();
  const user = userData?.user;
  if (!user) return json({ error: "Not signed in" }, 401);
  const { data: me } = await userClient.from("profiles").select("id,is_coach").eq("id", user.id).maybeSingle();
  if (!me?.is_coach) return json({ error: "Coach access only" }, 403);

  const admin = createClient(url, serviceKey);
  let body: { movement_screen_id?: string; panel_id?: string; email?: string; sex?: string; files?: SourceFile[] };
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }

  let panelId = body.panel_id;
  if (!panelId && body.files && body.email) {
    // Files uploaded elsewhere (audit form, My Plan): must be in the audit-uploads bucket
    const files = (Array.isArray(body.files) ? body.files : [])
      .filter((f) => f && typeof f.path === "string" && !f.path.includes(".."))
      .map((f) => ({ kind: "bloods", name: f.name ?? f.path, path: f.path, type: f.type ?? "" }));
    if (!files.length) return json({ error: "No files to read" }, 400);
    const sex = body.sex === "male" || body.sex === "female" ? body.sex : null;
    const { data: panel, error: pErr } = await admin.from("bloodwork_panels").insert({
      email: String(body.email).trim().toLowerCase(), source_files: files, sex, status: "extracting", extraction_model: MODEL,
    }).select("id").single();
    if (pErr) return json({ error: pErr.message }, 500);
    panelId = panel.id;
  } else if (!panelId) {
    if (!body.movement_screen_id) return json({ error: "Send movement_screen_id, panel_id, or email with files" }, 400);
    const { data: screen, error } = await admin
      .from("movement_screens").select("id,email,files").eq("id", body.movement_screen_id).maybeSingle();
    if (error || !screen) return json({ error: "Movement screen not found" }, 404);
    const files = ((screen.files ?? []) as SourceFile[]).filter((f) => f.kind === "bloods");
    if (!files.length) return json({ error: "No blood work files on this screen" }, 400);
    const { data: panel, error: pErr } = await admin.from("bloodwork_panels").insert({
      email: String(screen.email).trim().toLowerCase(), movement_screen_id: screen.id, source_files: files,
      sex: body.sex === "male" || body.sex === "female" ? body.sex : null, status: "extracting", extraction_model: MODEL,
    }).select("id").single();
    if (pErr) return json({ error: pErr.message }, 500);
    panelId = panel.id;
  } else {
    const { error } = await admin.from("bloodwork_panels")
      .update({ status: "extracting", error: null, extraction_model: MODEL }).eq("id", panelId);
    if (error) return json({ error: error.message }, 500);
  }

  EdgeRuntime.waitUntil(extract(admin, panelId!, me.id, apiKey).catch(async (e) => {
    await admin.from("bloodwork_panels").update({ status: "failed", error: String(e?.message ?? e) }).eq("id", panelId!);
  }));
  return json({ panel_id: panelId, status: "extracting" }, 202);
});

async function extract(admin: SupabaseClient, panelId: string, coachId: string, apiKey: string) {
  const { data: panel, error } = await admin.from("bloodwork_panels").select("*").eq("id", panelId).single();
  if (error || !panel) throw new Error("Panel not found");
  const files = (panel.source_files ?? []) as SourceFile[];

  // Build the file blocks
  const content: Record<string, unknown>[] = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const { data: blob, error: dErr } = await admin.storage.from(BUCKET).download(f.path);
    if (dErr || !blob) throw new Error(`Could not download ${f.name ?? f.path}`);
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const type = (f.type || blob.type || "").toLowerCase();
    content.push({ type: "text", text: `File ${i}: ${f.name ?? f.path}` });
    if (type === "application/pdf") {
      content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: encodeBase64(bytes) } });
    } else if (["image/jpeg", "image/png", "image/webp", "image/gif"].includes(type)) {
      if (bytes.length > MAX_IMAGE_BYTES) throw new Error(`${f.name ?? f.path} is over 5 MB; ask the client for a smaller photo or a PDF`);
      content.push({ type: "image", source: { type: "base64", media_type: type, data: encodeBase64(bytes) } });
    } else {
      throw new Error(`Unsupported file type for ${f.name ?? f.path}: ${type || "unknown"}`);
    }
  }

  // Coach's marker list for matching
  const { data: markers } = await admin.from("bloodwork_markers")
    .select("marker_key,display_name,unit,category").eq("coach_id", coachId);
  const seen = new Map<string, { display_name: string; unit: string | null; category: string }>();
  for (const m of markers ?? []) if (!seen.has(m.marker_key)) seen.set(m.marker_key, m);
  const markerList = [...seen.entries()].map(([k, m]) => `${k} | ${m.display_name} | ${m.unit ?? "-"}`).join("\n");

  content.push({
    type: "text",
    text: `These files are one person's blood test report (they may be photos of paper pages).
Record EVERY result printed, using the record_bloodwork tool.

Rules:
- Copy values, units and reference ranges exactly as printed. Do not convert units. Do not guess.
- If a value is cut off, blurred or ambiguous, still record it with confidence "low" and explain in notes.
- Set marker_key only when the test clearly matches one of these markers (key | name | unit); otherwise null:
${markerList}
- source_file_index is the File number the result appears on.
- Skip duplicates that appear on more than one photo; keep the clearest one.`,
  });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8000,
      tools: [RECORD_TOOL],
      tool_choice: { type: "tool", name: "record_bloodwork" },
      messages: [{ role: "user", content }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${(await res.text()).slice(0, 500)}`);
  const out = await res.json();
  const toolUse = (out.content ?? []).find((c: { type: string }) => c.type === "tool_use");
  if (!toolUse) throw new Error("No structured result returned");
  const data = toolUse.input as {
    collected_on?: string | null; lab_name?: string | null; sex?: string | null; notes?: string | null;
    results: Array<Record<string, unknown>>;
  };

  // Replace any previous pending results for this panel (re-runs)
  await admin.from("bloodwork_results").delete().eq("panel_id", panelId).eq("status", "pending");

  const rows = (data.results ?? []).map((r, i) => {
    const key = typeof r.marker_key === "string" && seen.has(r.marker_key) ? r.marker_key : null;
    const expectedUnit = key ? seen.get(key)!.unit : null;
    const unit = (r.unit as string | null) ?? null;
    const unitMismatch = !!(key && expectedUnit && unit &&
      expectedUnit.replace(/\s|µ/g, "u").toLowerCase() !== unit.replace(/\s|µ/g, "u").toLowerCase());
    const idx = Number(r.source_file_index ?? -1);
    return {
      panel_id: panelId,
      marker_key: key,
      raw_name: String(r.raw_name ?? "").slice(0, 200),
      category: key ? seen.get(key)!.category : null,
      value: typeof r.value === "number" ? r.value : null,
      value_text: r.value_text != null ? String(r.value_text) : null,
      unit,
      lab_low: typeof r.lab_low === "number" ? r.lab_low : null,
      lab_high: typeof r.lab_high === "number" ? r.lab_high : null,
      lab_range_text: (r.lab_range_text as string | null) ?? null,
      lab_flag: (r.lab_flag as string | null) ?? null,
      confidence: ["high", "medium", "low"].includes(String(r.confidence)) ? r.confidence : "low",
      needs_check: r.confidence !== "high" || !key || unitMismatch || typeof r.value !== "number",
      source_file: files[idx]?.path ?? null,
      status: "pending",
      sort_order: i,
    };
  });
  if (rows.length) {
    const { error: iErr } = await admin.from("bloodwork_results").insert(rows);
    if (iErr) throw new Error(iErr.message);
  }

  const validDate = data.collected_on && /^\d{4}-\d{2}-\d{2}$/.test(data.collected_on) ? data.collected_on : null;
  await admin.from("bloodwork_panels").update({
    status: "needs_review",
    collected_on: validDate,
    lab_name: data.lab_name ?? null,
    sex: data.sex === "male" || data.sex === "female" ? data.sex : panel.sex,
    extraction_notes: data.notes ?? null,
    extraction_raw: data,
    error: null,
  }).eq("id", panelId);
}
