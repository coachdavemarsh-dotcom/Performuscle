-- Private storage for blood work uploaded during the Performance Audit.
-- Applied to the live project on 2026-10-20 (migration: audit_uploads_bucket).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('audit-uploads', 'audit-uploads', false, 10485760,
        array['application/pdf','image/jpeg','image/png','image/heic','image/heif','image/webp'])
on conflict (id) do nothing;
-- Website visitors can upload, never list or read.
create policy "Public can upload audit files" on storage.objects for insert
  to anon, authenticated with check (bucket_id = 'audit-uploads');
-- Only coach accounts can read.
create policy "Coaches can read audit files" on storage.objects for select
  to authenticated using (bucket_id = 'audit-uploads'
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_coach));
