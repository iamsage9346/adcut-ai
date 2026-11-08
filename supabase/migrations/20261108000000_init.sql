-- adcut AI 초기 스키마: 병원(조직) → 영상 프로젝트 → 처리 작업
create extension if not exists "pgcrypto";

create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  specialty text,                 -- 피부과, 치과, 정형외과 ...
  brand_template jsonb default '{}'::jsonb,  -- 자막 폰트/색/로고 등
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  title text not null,
  script_text text,               -- 촬영 대본
  source_video_path text,         -- R2/Storage 경로
  output_video_path text,
  status text not null default 'draft' check (status in ('draft','uploaded','processing','done','failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  celery_task_id text,
  state text not null default 'PENDING',
  step text,                      -- stt | align | cut | subtitles | render
  error text,
  result jsonb,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);

create table public.trend_videos (
  id uuid primary key default gen_random_uuid(),
  platform text not null default 'youtube',
  external_id text not null,
  specialty text,
  title text,
  channel text,
  view_count bigint,
  like_count bigint,
  comment_count bigint,
  duration_sec int,
  analysis jsonb,                 -- 후킹 방식, 구성, 자막 스타일 등 Claude 분석 결과
  collected_at timestamptz not null default now(),
  unique (platform, external_id)
);

-- RLS: 자기 병원 데이터만
alter table public.clinics enable row level security;
alter table public.projects enable row level security;
alter table public.jobs enable row level security;
alter table public.trend_videos enable row level security;

create policy "own clinics" on public.clinics for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "own projects" on public.projects for all
  using (clinic_id in (select id from public.clinics where owner_id = auth.uid()))
  with check (clinic_id in (select id from public.clinics where owner_id = auth.uid()));
create policy "own jobs" on public.jobs for all
  using (project_id in (select p.id from public.projects p join public.clinics c on c.id = p.clinic_id where c.owner_id = auth.uid()));
create policy "trends readable" on public.trend_videos for select using (auth.role() = 'authenticated');

-- updated_at 자동 갱신
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger projects_updated_at before update on public.projects for each row execute function public.set_updated_at();

-- 원본 영상용 Storage 버킷 (R2 전환 전 로컬 개발용)
insert into storage.buckets (id, name, public) values ('videos', 'videos', false) on conflict do nothing;
