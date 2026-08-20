-- 0001_teams_foundation.sql
--
-- Fase 1, Nível 1 do plano (docs/PLAN.md §3). Fundação de multiusuário: teams, membership,
-- convites, log de atividade, e o predicado único de autorização (`is_team_member`) que toda
-- política RLS de tabela de recurso (Fase 3 em diante) vai reusar em vez de repetir um EXISTS
-- por tabela.
--
-- Nomenclatura inspirada no nextjs/saas-starter (teams/team_members/invitations/activity_logs)
-- por familiaridade, mas a autorização é centralizada numa função só — não 34 políticas
-- independentes copiadas e coladas.

create extension if not exists pgcrypto;

create table if not exists teams (
  id                      uuid primary key default gen_random_uuid(),
  name                    text not null,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  stripe_product_id       text,
  plan_name               text,
  subscription_status     text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'team_role') then
    create type team_role as enum ('owner', 'member');
  end if;
end $$;

create table if not exists team_members (
  team_id    uuid not null references teams(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       team_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

create table if not exists invitations (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references teams(id) on delete cascade,
  email       text not null,
  role        team_role not null default 'member',
  invited_by  uuid not null references auth.users(id),
  status      text not null default 'pending',
  token_hash  text not null unique,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

create table if not exists activity_logs (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid references teams(id) on delete cascade,
  user_id    uuid references auth.users(id),
  action     text not null,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists team_members_user_id_idx on team_members(user_id);
create index if not exists invitations_team_id_idx on invitations(team_id);
create index if not exists invitations_email_idx on invitations(email);
create index if not exists activity_logs_team_id_created_idx on activity_logs(team_id, created_at desc);

-- Predicado único de autorização multiusuário. `security invoker` (não definer) — segue o padrão
-- já validado no AppScanner original, onde todas as 29 RPCs eram SECURITY INVOKER com
-- search_path fixado (achado positivo da auditoria: docs de referência em
-- Executar-26/Executar-app-scanner). `stable` porque não modifica dados e o otimizador pode
-- reusar o resultado dentro de uma mesma query.
create or replace function is_team_member(target_team_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from team_members m
    where m.team_id = target_team_id
      and m.user_id = auth.uid()
  );
$$;

alter table teams enable row level security;
alter table team_members enable row level security;
alter table invitations enable row level security;
alter table activity_logs enable row level security;

-- teams: membro pode ver/atualizar; criação é feita via RPC create_team (Fase 1, Nível 1, item 1
-- do plano) que insere a linha em teams e a membership 'owner' na mesma transação — não expor
-- INSERT direto na tabela para evitar teams órfãos sem owner.
create policy teams_member_select on teams
  for select to authenticated
  using (is_team_member(id));

create policy teams_owner_update on teams
  for update to authenticated
  using (exists (
    select 1 from team_members m
    where m.team_id = teams.id and m.user_id = auth.uid() and m.role = 'owner'
  ));

-- team_members: qualquer membro do time pode ver os demais membros; só o próprio usuário deleta
-- sua própria linha (sair do time) — remoção de outros membros é uma RPC dedicada (Fase 1) que
-- também aplica a proteção de "último owner não pode sair", ainda não implementada nesta
-- migration inicial.
create policy team_members_select on team_members
  for select to authenticated
  using (is_team_member(team_id));

create policy team_members_leave on team_members
  for delete to authenticated
  using (user_id = auth.uid());

-- invitations: só membros do time-alvo veem/gerenciam convites do próprio time.
create policy invitations_member_select on invitations
  for select to authenticated
  using (is_team_member(team_id));

create policy invitations_owner_manage on invitations
  for all to authenticated
  using (exists (
    select 1 from team_members m
    where m.team_id = invitations.team_id and m.user_id = auth.uid() and m.role = 'owner'
  ))
  with check (exists (
    select 1 from team_members m
    where m.team_id = invitations.team_id and m.user_id = auth.uid() and m.role = 'owner'
  ));

-- activity_logs: leitura por membro do time; escrita só via RPC/service role (nunca INSERT
-- direto do cliente, para não permitir forjar entradas de auditoria).
create policy activity_logs_member_select on activity_logs
  for select to authenticated
  using (team_id is null or is_team_member(team_id));

-- Nada de GRANT explícito para `authenticated` além do que as políticas acima já habilitam via
-- RLS — Postgres ainda exige GRANT de tabela para o role antes de RLS entrar em jogo.
grant select, update on teams to authenticated;
grant select, delete on team_members to authenticated;
grant select, insert, update, delete on invitations to authenticated;
grant select on activity_logs to authenticated;
