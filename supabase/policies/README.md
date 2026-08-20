# supabase/policies

Políticas RLS das tabelas de *produto* (projects, areas, deliverables, actions, document_files,
qr_routes etc.) chegam aqui na Fase 3, quando `packages/db` reimplementa os repositórios do
AppScanner contra o schema novo — ver `docs/PLAN.md` §3.

A fundação de teams/membership (Fase 1) está em
`supabase/migrations/0001_teams_foundation.sql`, incluindo a função `is_team_member(team_id)`
que toda política de tabela de recurso vai reusar.
