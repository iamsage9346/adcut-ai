-- videos 버킷: 로그인 사용자가 자기 폴더({user_id}/...)에만 읽기/쓰기
create policy "videos: own folder select" on storage.objects for select to authenticated
  using (bucket_id = 'videos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "videos: own folder insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'videos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "videos: own folder delete" on storage.objects for delete to authenticated
  using (bucket_id = 'videos' and (storage.foldername(name))[1] = auth.uid()::text);

-- 업로드 용량 한도 500MB, 영상만
update storage.buckets set file_size_limit = 524288000, allowed_mime_types = array['video/mp4','video/quicktime','video/webm'] where id = 'videos';
