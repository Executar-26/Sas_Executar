# EXECUTAR SaaS

Reconstrução do produto EXECUTAR (planos navegáveis + scanner de documentos) sobre uma fundação
de identidade e multiusuário real — Supabase Auth + RLS de time (não dono único), CI que bloqueia
merge de fato, observabilidade e rate limiting desde o primeiro commit, e distribuição nativa via
Expo para Google Play **e** Apple App Store.

**Plano completo, com contexto de por que este repositório existe e por que a arquitetura é essa:
[`docs/PLAN.md`](./docs/PLAN.md).** Leia isso antes de tocar em qualquer pacote — cada
`packages/*/README.md` também documenta de onde vem o código que entra ali e em qual fase.

## Stack

- **Web:** Next.js App Router + Supabase (Auth/Postgres/RLS/Storage) + Stripe.
- **Mobile:** Expo Router (React Native), câmera/OCR/QR nativos (ML Kit/Vision), EAS
  Build/Submit/Update, Google Play + Apple App Store.
- **Monorepo:** Turborepo + pnpm workspaces — `apps/{web,mobile}` + `packages/*` compartilhados.

## Estado atual

Scaffold inicial (Fase -1 do plano): estrutura de monorepo, plano documentado, primeira migration
de banco (`supabase/migrations/0001_teams_foundation.sql` — teams/membership/RLS), CI mínimo.
**Nenhum código de produto foi portado ainda** — isso começa na Fase 0/1, ver
[`docs/PLAN.md`](./docs/PLAN.md) §5 para a sequência completa e §6 para qual modelo/esforço do
Claude Code usar em cada fase.

## Desenvolvimento

```bash
pnpm install
pnpm build      # turbo run build em todos os pacotes/apps
pnpm typecheck
pnpm lint
pnpm test
```

Cada pacote/app ainda sem código real tem esses scripts como placeholders (`echo` avisando a fase
pendente) — isso é intencional, não um bug: mantém o CI verde e honesto sobre o que existe de
fato, em vez de fingir cobertura que não existe.
