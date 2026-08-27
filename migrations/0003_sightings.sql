create table if not exists sighting_files (
  id text primary key,
  guest_id text not null,
  alias text not null,
  title text not null,
  location text not null default '',
  incident_date text not null default '',
  description text not null,
  extra text not null default '',
  image_data text,
  image_name text,
  video_data text,
  video_name text,
  created_at timestamptz not null default now()
);

create index if not exists sighting_files_created_at_idx on sighting_files (created_at desc);

create table if not exists sighting_likes (
  sighting_id text not null,
  guest_id text not null,
  created_at timestamptz not null default now(),
  primary key (sighting_id, guest_id)
);

create table if not exists sighting_comments (
  id text primary key,
  sighting_id text not null,
  guest_id text not null,
  alias text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists sighting_comments_file_idx on sighting_comments (sighting_id, created_at);
