create table if not exists public.review_photos (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.product_reviews(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  created_at timestamptz not null default now(),
  display_order integer not null default 0
);

create index if not exists idx_review_photos_review_id
  on public.review_photos(review_id);

create index if not exists idx_review_photos_review_display_order
  on public.review_photos(review_id, display_order);

alter table public.review_photos enable row level security;

create policy "review_photos_select_approved"
  on public.review_photos
  for select
  using (
    exists (
      select 1
      from public.product_reviews pr
      where pr.id = review_photos.review_id
        and pr.is_approved = true
    )
  );

create policy "review_photos_insert_public"
  on public.review_photos
  for insert
  with check (true);

create policy "review_photos_update_public"
  on public.review_photos
  for update
  using (true)
  with check (true);

create policy "review_photos_delete_public"
  on public.review_photos
  for delete
  using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'review-photos',
  'review-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

create policy "review_photo_storage_select_public"
  on storage.objects
  for select
  using (bucket_id = 'review-photos');

create policy "review_photo_storage_insert_public"
  on storage.objects
  for insert
  with check (
    bucket_id = 'review-photos'
    and (auth.role() = 'anon' or auth.role() = 'authenticated')
  );

create policy "review_photo_storage_update_public"
  on storage.objects
  for update
  using (bucket_id = 'review-photos')
  with check (bucket_id = 'review-photos');

create policy "review_photo_storage_delete_public"
  on storage.objects
  for delete
  using (bucket_id = 'review-photos');
