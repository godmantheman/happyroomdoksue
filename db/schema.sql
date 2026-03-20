create table if not exists reading_books (
  id text primary key,
  title text not null,
  memo text not null default '',
  student_class text not null default '',
  student_name text not null default '',
  created_at timestamptz not null default now()
);
