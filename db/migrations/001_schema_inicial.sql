-- 001: schema inicial do Amigos da Adoção (projeto Supabase do Mercadinho Universitário)
create schema if not exists amigos_adocao;

grant usage on schema amigos_adocao to anon, authenticated, service_role;

create type amigos_adocao.tipo_card as enum ('adocao', 'procura_se');
create type amigos_adocao.status_card as enum ('ativo', 'resolvido', 'arquivado');
create type amigos_adocao.especie as enum ('cachorro', 'gato', 'outro');
create type amigos_adocao.porte as enum ('pequeno', 'medio', 'grande');
create type amigos_adocao.sexo as enum ('macho', 'femea', 'desconhecido');
create type amigos_adocao.idade as enum ('filhote', 'jovem', 'adulto', 'idoso');
create type amigos_adocao.estilo_card as enum ('polaroid', 'cartaz', 'destaque');

create table amigos_adocao.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text,
  tipo text not null default 'pessoa' check (tipo in ('pessoa', 'ong', 'protetor')),
  criado_em timestamptz not null default now()
);

create table amigos_adocao.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tipo amigos_adocao.tipo_card not null,
  status amigos_adocao.status_card not null default 'ativo',
  nome_animal text not null check (char_length(nome_animal) between 1 and 20),
  especie amigos_adocao.especie not null,
  porte amigos_adocao.porte,
  sexo amigos_adocao.sexo not null default 'desconhecido',
  -- adoção
  idade amigos_adocao.idade,
  saude text[] not null default '{}',            -- castrado, vacinado, vermifugado
  jeito text[] not null default '{}' check (cardinality(jeito) <= 3),
  frase text check (char_length(frase) <= 120),
  -- procura-se: sinais para reconhecer
  sinais text check (char_length(sinais) <= 80),
  foto_path text,                                -- caminho no bucket amigos-adocao
  cidade text not null,
  bairro text,
  contato_publico text not null,                 -- o que o usuário escolhe mostrar no card
  -- procura-se
  visto_por_ultimo_em date,
  local_visto_por_ultimo text,
  recompensa text,
  -- aparência
  estilo amigos_adocao.estilo_card not null default 'polaroid',
  cor_tema text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint procura_se_campos check (
    tipo <> 'procura_se' or (visto_por_ultimo_em is not null and local_visto_por_ultimo is not null)
  )
);

create index cards_user_id_idx on amigos_adocao.cards (user_id);
create index cards_publicos_idx on amigos_adocao.cards (tipo, cidade) where status = 'ativo';

create or replace function amigos_adocao.tocar_atualizado_em()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.atualizado_em := now();
  return new;
end $$;

create trigger cards_atualizado_em before update on amigos_adocao.cards
  for each row execute function amigos_adocao.tocar_atualizado_em();

-- RLS
alter table amigos_adocao.perfis enable row level security;
alter table amigos_adocao.cards enable row level security;

create policy perfis_dono on amigos_adocao.perfis
  for all to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy cards_leitura_publica on amigos_adocao.cards
  for select to anon, authenticated using (status = 'ativo');
create policy cards_dono_select on amigos_adocao.cards
  for select to authenticated using ((select auth.uid()) = user_id);
create policy cards_dono_insert on amigos_adocao.cards
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy cards_dono_update on amigos_adocao.cards
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy cards_dono_delete on amigos_adocao.cards
  for delete to authenticated using ((select auth.uid()) = user_id);

grant select on amigos_adocao.cards to anon;
grant select, insert, update, delete on amigos_adocao.cards, amigos_adocao.perfis to authenticated;

-- Storage: bucket de fotos (leitura pública, escrita só na pasta do próprio usuário)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('amigos-adocao', 'amigos-adocao', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy amigos_adocao_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'amigos-adocao' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy amigos_adocao_update on storage.objects for update to authenticated
  using (bucket_id = 'amigos-adocao' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy amigos_adocao_delete on storage.objects for delete to authenticated
  using (bucket_id = 'amigos-adocao' and (storage.foldername(name))[1] = (select auth.uid())::text);
