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

## Pré-requisitos

- Node.js 20+ (`.nvmrc` na raiz — `nvm use` se você usa nvm).
- pnpm — a versão exata está pinada em `package.json` (`packageManager`); rode
  `corepack enable` uma vez e o pnpm certo é resolvido sozinho, sem instalar globalmente.
- Conta Supabase (Fase 1 em diante) e Supabase CLI se for rodar o banco localmente
  (`supabase/config.toml` já está configurado para isso).

## Desenvolvimento

```bash
pnpm install
pnpm build      # turbo run build em todos os pacotes/apps
pnpm dev        # turbo run dev (apps/web + apps/mobile, quando existirem)
pnpm typecheck
pnpm lint
pnpm test
```

Cada pacote/app ainda sem código real tem esses scripts como placeholders (`echo` avisando a fase
pendente) — isso é intencional, não um bug: mantém o CI verde e honesto sobre o que existe de
fato, em vez de fingir cobertura que não existe.

## Variáveis de ambiente

Referência canônica e comentada em [`.env.example`](./.env.example) na raiz — cobre todas as
fases do plano, não só o que já tem código para consumir hoje. Para desenvolver:

```bash
cp apps/web/.env.example apps/web/.env.local      # quando apps/web existir de verdade (Fase 0)
cp apps/mobile/.env.example apps/mobile/.env      # quando apps/mobile existir de verdade (Fase 6)
```

Nenhum arquivo `.env*` além dos `*.example` é versionado (ver `.gitignore`). Segredo real nunca
entra em commit, PR, ou log — se algum vazar, trate como comprometido e gire a credencial, não
só remova o commit.

## Workflows / CI

Um workflow hoje: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) — `install → typecheck
→ lint → test → build`, disparado em todo push a `main` e em todo pull request, **sem filtro de
path**. Isso é deliberado (`docs/PLAN.md` §5 Fase 0): a auditoria que motivou este projeto
encontrou um CI com filtro de path estreito demais deixando superfícies inteiras (auth, rate
limit, camada de UI) sem cobertura nenhuma — a política aqui é rodar tudo sempre, e só estreitar
depois com evidência real de custo.

**Pendência conhecida, não automatizável por API:** branch protection em `main` exigindo esse
workflow como status check obrigatório precisa ser ligada manualmente em
`Settings → Branches → Add rule` no GitHub — nenhuma ferramenta disponível nesta sessão cobre essa
configuração. Sem isso, CI vermelho não impede merge, o que anula o propósito do workflow — trate
isso como bloqueador antes de considerar a Fase 0 encerrada, não como detalhe opcional (é
literalmente o achado #1 da auditoria que originou este repositório: CI existia mas não bloqueava
merge).

Workflows futuros previstos pelo plano (ainda não criados): validação de migration contra Postgres
efêmero, `npm audit`/Dependabot/CodeQL, empacotamento EAS Build/Submit (Fase 10) — ver
`docs/PLAN.md` §5/§16.

## Convenções de contribuição

Ver [`CONTRIBUTING.md`](./CONTRIBUTING.md).
