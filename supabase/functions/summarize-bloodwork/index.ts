// summarize-bloodwork
// Writes a coach-facing summary of one blood work panel with Claude: what stands out, what it
// means, and how to improve it through nutrition, lifestyle and supplements. Coach-only.
//
// POST { "panel_id": "<uuid>", "items": [...], "context": { ... } }
//   items: one per value, already scored against the coach's functional ranges by the dashboard
// Returns { status: "writing" } straight away; the summary lands in bloodwork_panels.summary.
//
// Needs the ANTHROPIC_API_KEY secret (same one as extract-bloodwork).

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";

const MODEL = "claude-sonnet-5-5";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const str = { type: "string" };
const strs = { type: "array", items: str };
const SUMMARY_TOOL = {
  name: "record_summary",
  description: "Record the blood work summary for the coach.",
  input_schema: {
    type: "object",
    properties: {
      headline: { type: "string", description: "One sentence: the single most important takeaway" },
      overview: { type: "string", description: "3-5 sentences in plain English" },
      findings: {
        type: "array",
        description: "Grouped findings, most important first. Group related markers (e.g. thyroid, lipids, iron, hormones).",
        items: {
          type: "object",
          properties: {
            title: str,
            status: { type: "string", enum: ["flag", "watch", "good"] },
            markers: { type: "string", description: "The markers and values, with dates if they changed, e.g. 'Ferritin 38 µg/L (functional 70-150)'" },
            meaning: { type: "string", description: "What it means and why it matters for this person, 2-3 sentences" },
          },
          required: ["title", "status", "markers", "meaning"],
        },
      },
      priorities: { ...strs, description: "The top 3 things to work on, in order" },
      nutrition: { ...strs, description: "Specific food and nutrition actions" },
      lifestyle: { ...strs, description: "Sleep, training, stress, sunlight, alcohol and similar actions" },
      supplements: {
        type: "array",
        items: {
          type: "object",
          properties: { name: str, dose: str, why: str, caution: str },
          required: ["name", "dose", "why"],
        },
      },
      retest: { ...strs, description: "What to retest and when" },
      gp: { ...strs, description: "Anything the client should take to their GP or prescribing doctor, and why" },
      client_message: { type: "string", description: "A short, warm summary written to the client in second person, for the coach to edit and send" },
    },
    required: ["headline", "overview", "findings", "priorities", "nutrition", "lifestyle", "supplements", "retest", "gp", "client_message"],
  },
};

type Item = {
  marker?: string; raw?: string; value?: string; unit?: string; lab?: string;
  functional?: string; state?: string; date?: string; flag?: string; confirmed?: boolean;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) return json({ error: "ANTHROPIC_API_KEY secret is not set" }, 500);

  const authHeader = req.headers.get("Authorization") ?? "";
  const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
  const { data: userData } = await userClient.auth.getUser();
  if (!userData?.user) return json({ error: "Not signed in" }, 401);
  const { data: me } = await userClient.from("profiles").select("id,is_coach").eq("id", userData.user.id).maybeSingle();
  if (!me?.is_coach) return json({ error: "Coach access only" }, 403);

  let body: { panel_id?: string; items?: Item[]; context?: Record<string, unknown> };
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }
  const items = (Array.isArray(body.items) ? body.items : []).slice(0, 600);
  if (!body.panel_id || !items.length) return json({ error: "Send panel_id and the values to summarise" }, 400);

  const admin = createClient(url, serviceKey);
  const { data: panel } = await admin.from("bloodwork_panels").select("id,extraction_notes,sex,collected_on").eq("id", body.panel_id).maybeSingle();
  if (!panel) return json({ error: "Blood work panel not found" }, 404);
  const started = new Date().toISOString();
  await admin.from("bloodwork_panels").update({ summary: { status: "writing", started } }).eq("id", panel.id);

  EdgeRuntime.waitUntil(write(admin, panel, items, body.context ?? {}, apiKey, started).catch(async (e) => {
    await admin.from("bloodwork_panels").update({ summary: { status: "failed", error: String(e?.message ?? e), at: new Date().toISOString() } }).eq("id", panel.id);
  }));
  return json({ status: "writing" }, 202);
});

async function write(
  admin: SupabaseClient, panel: { id: string; extraction_notes: string | null; sex: string | null; collected_on: string | null },
  items: Item[], context: Record<string, unknown>, apiKey: string, started: string,
) {
  const clip = (v: unknown, n = 160) => String(v ?? "").replace(/\s+/g, " ").slice(0, n);
  const lines = items.map((i) =>
    [clip(i.marker || i.raw, 80), clip(i.value, 20) + (i.unit ? " " + clip(i.unit, 20) : ""), i.date ? "date " + clip(i.date, 12) : "",
      i.lab ? "lab " + clip(i.lab, 40) : "", i.functional ? "functional " + clip(i.functional, 40) : "",
      clip(i.state, 30), i.flag ? "lab flag " + clip(i.flag, 10) : "", i.confirmed ? "confirmed" : "unconfirmed"]
      .filter(Boolean).join(" | "),
  ).join("\n");
  const ctx = Object.entries(context).filter(([, v]) => v != null && String(v).trim())
    .map(([k, v]) => `${k}: ${clip(v, 800)}`).join("\n");

  const prompt = `You are helping a high-performance health coach review a client's blood work.
The coach uses functional ranges (tighter, optimal targets) alongside the lab's reference ranges.
Each line below is one value: marker | value unit | date | lab range | functional range | status against the functional range | lab flag | whether the coach has confirmed it.

Client context:
Sex: ${panel.sex ?? "not given"}
${ctx || "(none given)"}

Notes from reading the reports:
${clip(panel.extraction_notes, 4000) || "(none)"}

Values:
${lines}

Write the summary with the record_summary tool. Rules:
- Lead with what matters most. Group related markers (thyroid, sex hormones, lipids, glucose and insulin, iron, liver, kidney, inflammation, blood count, vitamins and minerals). Mention markers that are in range only where it adds context.
- Where a marker has several dates, describe the trend and lead with the most recent value.
- "Unit differs" means the lab used a different unit from the coach's range: judge it only by the lab range and lab flag, and never convert units yourself.
- Be specific and practical: name the foods, habits and doses. Keep supplement doses conservative and evidence-informed, and note interactions or who should avoid them.
- You are supporting a coach, not a doctor. Do not diagnose, and do not recommend starting, stopping or changing any prescription medicine, hormone (including TRT) or its dose. Put anything that needs medical review (values flagged critical, likely medication effects, possible disease) under gp, explained plainly.
- Write in Australian English. Plain language, no jargon without a short explanation.

Respond only by calling the record_summary tool once. Do not reply in text.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 12000,
      tools: [SUMMARY_TOOL],
      tool_choice: { type: "auto" },
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const out = await res.json();
  const toolUse = (out.content ?? []).find((c: { type: string }) => c.type === "tool_use");
  if (!toolUse) throw new Error(out.stop_reason === "max_tokens" ? "The summary ran too long. Try again." : "Claude replied without writing the summary. Try again.");
  await admin.from("bloodwork_panels").update({
    summary: { status: "ready", at: new Date().toISOString(), started, model: MODEL, values: items.length, ...(toolUse.input as Record<string, unknown>) },
  }).eq("id", panel.id);
}
