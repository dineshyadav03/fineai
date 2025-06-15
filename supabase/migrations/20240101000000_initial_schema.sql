-- Create tables for fine-tuning platform

-- Enable RLS
alter table auth.users enable row level security;

-- Create fine-tuning jobs table
create table public.fine_tuning_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id text not null,
  model text not null,
  task text not null,
  dataset_path text not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table public.fine_tuning_jobs enable row level security;

create policy "Users can view their own jobs"
  on public.fine_tuning_jobs for select
  using (auth.uid() = user_id);

create policy "Users can create their own jobs"
  on public.fine_tuning_jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own jobs"
  on public.fine_tuning_jobs for update
  using (auth.uid() = user_id);

-- Create storage bucket for datasets
insert into storage.buckets (id, name, public) values ('datasets', 'datasets', false);

-- Create storage policies
create policy "Users can upload their own datasets"
  on storage.objects for insert
  with check (
    bucket_id = 'datasets' and
    auth.uid() = owner
  );

create policy "Users can view their own datasets"
  on storage.objects for select
  using (
    bucket_id = 'datasets' and
    auth.uid() = owner
  );

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_updated_at
  before update on public.fine_tuning_jobs
  for each row
  execute procedure public.handle_updated_at(); 