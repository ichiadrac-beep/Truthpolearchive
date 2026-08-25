create table if not exists pole_messages (
  id text primary key,
  guest_id text not null,
  alias text not null,
  body text not null,
  anon boolean not null default false,
  scif_code text not null default 'SCIF-1',
  scif_title text not null default 'CONFIDENTIAL',
  created_at timestamptz not null default now()
);

create index if not exists pole_messages_created_at_idx on pole_messages (created_at);

create table if not exists pole_presence (
  guest_id text primary key,
  seen_at timestamptz not null default now()
);
