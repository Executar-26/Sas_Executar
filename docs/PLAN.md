# EXECUTAR SaaS — Plano de implementação

> Status: plano aprovado. Este documento é a referência viva do projeto — cada fase, ao ser
> concluída, deve ser marcada como tal aqui (ou substituída por um issue/board, se preferir),
> não deixada para a memória de quem está codando.

## Contexto

O AppScanner atual (`Executar-26/Executar-app-scanner`) passou por uma auditoria de prontidão de
produção (`docs/audits/PRODUCTION_READINESS_AUDIT.md` no repo `Executar-26/Executar`) que
encontrou domínio/RPCs/qualidade de código sólidos, mas uma base de identidade e multiusuário
inexistente: autenticação 100% anônima sem conta durável, RLS de dono único
(`owner_id = auth.uid()`) em 100% das 34 tabelas, CI quebrado por dias sem ninguém bloquear
merge, rate limiting em memória, zero observabilidade de erro. A decisão tomada foi reconstruir
sobre uma fundação nova em vez de remendar essa — usando o padrão do template `nextjs/saas-starter`
da Vercel (teams/roles/Stripe) combinado com Supabase (Auth real, RLS, Storage — a camada que a
auditoria considerou boa) como base web, e adicionando Expo para alcançar Google Play **e** Apple
App Store (TWA sozinho não chega à App Store — a Apple não tem caminho de listagem para
PWA-wrapper).

Durante o desenho, foi encontrado um achado de governança relevante: o repo `Executar-26/Executar`
(outro produto da mesma organização) tem uma ADR (ADR-003) que rejeita "novo repositório a partir
de template" pelo motivo genérico de duplicar chassis, e já tem organizations/RLS/billing/
observability prontos — mas **o dono do produto confirmou que essa ADR não se aplica aqui**:
`Sas_Executar` é deliberadamente um produto/repositório separado. Este plano segue nessa base, sem
reusar código daquele outro repo — só absorvendo, como referência de padrão comprovado, o desenho
de RLS de owner unificado (ver §3), que resolve um problema real do AppScanner (migração
anônimo→registrado) melhor do que a forma literal do `nextjs/saas-starter`.

**Decisões travadas:**
- Repositório: `Executar-26/Sas_Executar`, novo, independente — ADR-003 não se aplica.
- Gerador de plano por IA: mantém **OpenAI** (porte direto do `plan-generator.ts`, sem reescrever
  prompt/schema).
- Login: **Google + Sign in with Apple juntos desde a Fase 1** (não só e-mail/senha+magic link) —
  porque qualquer login social obriga a Apple (Guideline 4.8) a ter Sign in with Apple como
  equivalente, e a decisão foi resolver isso de uma vez em vez de retrabalho depois.

---

## 1. Estrutura do repositório — monorepo único (Turborepo + pnpm)

Monorepo único, não dois repos (web+mobile) separados. Motivo: equipe pequena/um contribuidor
muito ativo (evidência da auditoria) — dois repos forçariam publish-and-bump de pacote npm privado
a cada mudança de domínio compartilhado, sem ganho real de isolamento. `workspace:*` no monorepo
elimina esse atrito.

```
Sas_Executar/
├── apps/
│   ├── web/                  # Next.js App Router — inspirado na forma do nextjs/saas-starter,
│   │                         # auth substituída por Supabase Auth (ver §4)
│   │   ├── app/(dashboard)/  # produto autenticado
│   │   ├── app/(login)/      # rotas de auth (Supabase Auth: e-mail/senha, magic link, Google, Apple)
│   │   ├── app/api/{stripe,team,user,emit,ai,resolve,qr,mcp}/
│   │   ├── components/ui/    # shadcn/ui
│   │   └── lib/{auth,db,payments}/
│   └── mobile/                # Expo Router (SDK 54/55, RN 0.83+/React 19.2)
│       ├── app/                # rotas Expo Router
│       ├── modules/            # wrappers de módulo nativo (câmera, ocr, qr)
│       └── app.json / eas.json
├── packages/
│   ├── domain/          # ← src/domain/** do AppScanner (execution, canonical-state, qr-route,
│   │                     #   qr-token, scanner-command, task-dashboard, project-selector, weekdays)
│   ├── emit/             # ← src/emit/** (engine.ts, document-factory/, document-rendering/)
│   ├── fractal/           # ← src/fractal/** (FractalPlan, adapters JSON/Markdown, preflight, selectors)
│   ├── ai-plan/           # ← src/ai/plan-generator.ts (mantém OpenAI) + guided-plan-method.ts
│   ├── mcp-runtime/       # ← src/mcp/registry.ts, xlsx-runtime.ts, binary-artifact-runtime.ts,
│   │                       #   schema-validator.ts, execution-state-engine.ts, copilot-runtime.ts, skill-runtime.ts
│   ├── db/                # schema Supabase tipado + RPCs + RLS (ver §3)
│   ├── scanner-core/       # ← src/scanner/roi.ts, stabilizer.ts (geometria pura, sem plataforma)
│   ├── scanner-web/        # ← src/scanner/camera.ts, image-preprocessor.ts, frame-sampler.ts,
│   │                        #   ocr.ts (Tesseract.js), zxing-qr.ts — só apps/web
│   ├── scanner-native/     # NOVO — expo-camera + ML Kit/Vision, só apps/mobile
│   ├── ui/                 # shadcn/ui + Tailwind — só apps/web
│   └── config/             # eslint/tsconfig/tailwind compartilhados
├── supabase/
│   ├── migrations/
│   └── policies/
├── turbo.json
├── pnpm-workspace.yaml
└── .github/workflows/ci.yml
```

## 2. Mapa de portabilidade (o que entra em cada pacote)

| Pacote novo | Origem (AppScanner) | Portabilidade |
|---|---|---|
| `packages/domain` | `src/domain/*.ts` (8 arquivos, 1.114 LOC) | **Como está.** Zero I/O, zero Supabase. Copiar e ajustar imports só. |
| `packages/emit` | `src/emit/**` (~5.100 LOC) | **Como está.** Geração SVG/HTML server-side pura, recebe objetos, não consulta banco. |
| `packages/fractal` | `src/fractal/**` | **Como está.** Formato `FractalPlan` + adapters JSON/Markdown + preflight, sem acoplamento a Supabase. |
| `packages/ai-plan` | `src/ai/plan-generator.ts` + `guided-plan-method.ts` | **Como está** (mantém OpenAI, `OPENAI_API_KEY`/`OPENAI_PLAN_MODEL` seguem como env vars). |
| `packages/mcp-runtime` | `src/mcp/registry.ts`, `xlsx-runtime.ts`, `binary-artifact-runtime.ts`, `schema-validator.ts` (como está) + `execution-state-engine.ts`, `copilot-runtime.ts`, `skill-runtime.ts` (algoritmo porta, dependências de tabela precisam do rework do §3) | Misto. |
| `packages/scanner-core` | `src/scanner/roi.ts`, `stabilizer.ts` | **Como está.** Reusado por `scanner-web` e `scanner-native`. |
| `packages/scanner-web` | `src/scanner/camera.ts`, `image-preprocessor.ts`, `frame-sampler.ts`, `ocr.ts`, `zxing-qr.ts` | **Como está**, mas só web (getUserMedia/Canvas2D/WASM). |
| `packages/scanner-native` | Novo — porta a *orquestração* de `fast-folder-detector.ts`, `symbol-command-detector.ts`, `symbol-command-watcher.ts`, `scanner-controller.ts` | **Rework de runtime.** Ver §5 Fase 7. |
| `packages/db` | `supabase/migrations/**` (38 arquivos, 7.692 LOC) reimplementadas + `src/persistence/**` (7 repositórios) | **Rework de schema.** Ver §3. |

`src/lib/*-actions.ts` (10 Server Actions) e `src/app/api/**` (12 rotas) do AppScanner **não viram
pacote** — ficam em `apps/web`, suas formas/propósitos portam diretamente, implementações são
reconectadas ao schema novo.

## 3. Banco de dados / RLS

Nomenclatura do `nextjs/saas-starter` + predicado de autorização único (mais robusto que `EXISTS`
repetido em 34 tabelas, e resolve migração anônimo→registrado nativamente). Ver
`supabase/migrations/0001_teams_foundation.sql` para a migration inicial já escrita (`teams`,
`team_role`, `team_members`, `invitations`, `activity_logs`, função `is_team_member()`).

Toda tabela de recurso do AppScanner (`projects`, `areas`, `deliverables`, `actions`,
`document_files`, `qr_routes` etc.) ganha `team_id` quando for portada (Fase 3). A política RLS
deixa de ser `using (auth.uid() = owner_id)` e passa a usar `is_team_member(team_id)`:

```sql
using (is_team_member(team_id))
```

### Sequência dos ~26 contratos de RPC (por dependência real, não ordem alfabética)

**Nível 1 — bloqueia tudo o resto:**
1. `create_team` (novo — não existe hoje no AppScanner, é o próprio gap multiusuário).
2. `accept_invitation` (novo, `security definer`, lookup por token hash + insere membership).
3. `create_execution_project` com `team_id` (rework — trocar o check de `owner_id` por `is_team_member`).
4. A função `is_team_member()` em si — **já criada em `0001_teams_foundation.sql`**.

**Nível 2 — autoridade de domínio, maior risco de negócio:**
5. `act1_canonical_state_authority.sql` (788 LOC no AppScanner) — a "Completion Authority": único
   caminho para DONE, defesa de limite de WIP. **Maior risco de porte de todo o plano** — preservar
   a regra de negócio exatamente, só trocar o check de autorização interno.
6. `act1_canonical_import.sql` (391 LOC) — import idempotente de plano com replay por checksum.
7. `calculate_plan_state`, `replan_project` — dependem do #5.

**Nível 3** — resto (RPCs de QR, documentos/evidência, MCP): qualquer ordem, seguem as fases do §5.

**Regra obrigatória:** todo RPC de Nível 2/3 leva seu teste de isolamento (`time A não lê/escreve
dados do time B`) no mesmo PR que o cria — não depois. Achado da auditoria original: zero testes
desse tipo existiam no AppScanner.

## 4. Autenticação

Supabase Auth (não a auth hand-rolled do `nextjs/saas-starter`):

- **E-mail/senha** — base.
- **Magic link** (`signInWithOtp`) — evita ter que construir fluxo de "esqueci a senha".
- **Google OAuth** + **Sign in with Apple** juntos desde a Fase 1 — `expo-apple-authentication` no
  mobile, Supabase OAuth provider no web; construir os dois no mesmo PR, não faseado.
- **Upgrade anônimo→registrado** via sessão anônima do Supabase + `linkIdentity`/RPC de upgrade
  dedicada — resolve o achado F-003 da auditoria original.
- **Exclusão de conta** com `DELETE` real no banco + RPC dedicada, alcançável tanto de dentro do
  app (obrigatório para Apple, Guideline 5.1.1(v)) quanto por uma página web pública (suficiente
  para Google Play) — resolve o achado F-005.

## 5. Sequência de construção (fases, por dependência real)

- [x] **Fase -1 — Scaffold inicial deste repositório** (este PR): estrutura de monorepo, plano
      documentado, primeira migration, CI mínimo. Não inclui código de produto ainda.
- [ ] **Fase 0 — CI/CD + observabilidade + rate limiting completos.** Branch protection ligada no
      mesmo PR que endurece o workflow. Sentry/otel wired desde o primeiro server action. Rate
      limiting distribuído (Upstash Redis ou equivalente) aplicado a toda rota mutante desde o
      início. CSP + headers de segurança.
- [ ] **Fase 1 — Teams/auth/RLS.** RPCs de Nível 1, Supabase Auth completo (e-mail/senha + magic
      link + Google + Apple), upgrade anônimo→registrado, exclusão de conta. Suíte de teste de
      isolamento criada aqui (vazia, mas no CI).
- [ ] **Fase 2 — Porte dos pacotes portáveis-como-estão.** `domain`, `emit`, `fractal`,
      `scanner-core`, partes puras de `mcp-runtime`.
- [ ] **Fase 3 — Persistência + Server Actions + rotas de API contra o schema novo.** `packages/db`,
      7 repositórios, 10 Server Actions, 12 rotas. RPCs de Nível 2
      (`act1_canonical_state_authority` e `act1_canonical_import` primeiro).
- [ ] **Fase 4 — Scanner web (Tesseract.js/zxing-wasm como estão).** Checkpoint: Gates Público +
      Multiusuário devem estar demonstráveis ao final desta fase.
- [ ] **Fase 5 — Stripe/billing.** Porte de `lib/payments/stripe.ts` quase como está.
- [ ] **Fase 6 — Scaffold Expo, compartilhando pacotes.** Prova que o boundary de pacote
      compartilhado funciona sob Metro/Hermes. Ainda sem câmera/OCR real.
- [ ] **Fase 7 — Porte nativo de câmera/OCR/QR.** `packages/scanner-native`. Fazer um spike isolado
      e antecipado do OCR nativo (maior incerteza do plano) antes de comprometer a fase inteira.
- [ ] **Fase 8 — Compliance Google Play.** API 36 desde a primeira config de build. Data Safety,
      Política de Privacidade, exclusão de conta com entrada mobile. Faixa de teste fechado
      (≥12 testadores, 14 dias consecutivos) se aplicável — iniciar assim que houver build.
- [ ] **Fase 9 — Compliance Apple App Store.** Exclusão de conta alcançável dentro do app no iOS.
      Guideline 2.5.14, Privacy Nutrition Labels + Privacy Manifest, TestFlight.
- [ ] **Fase 10 — Pipeline EAS Build/Submit/Update.** EAS Update restrito por escrito a
      correções/ajustes de UI, nunca entrega de feature (Guideline 2.5.2).

## 6. Modelo e esforço no Claude Code por fase

| Fase | Natureza do trabalho | Modelo recomendado | Por quê |
|---|---|---|---|
| 0 — Scaffold/CI/observabilidade | Config bem especificada, padrões conhecidos | **Sonnet 5**, esforço padrão | Baixa ambiguidade, alto volume de boilerplate correto |
| 1 — Teams/auth/RLS | Desenho de predicado de segurança multiusuário — erro aqui é P0 | **Opus 5, esforço alto** | Erro aqui reintroduz o problema central da auditoria. Seguir com `/security-review` ou `/code-review --level=high` no diff antes de merge |
| 2 — Porte dos pacotes puros | Ajuste mecânico de imports, preservando lógica testada | **Sonnet 5**, esforço padrão | Bom candidato a paralelizar (um agente por pacote) |
| 3 — Persistência + `act1_canonical_state_authority` | Lógica transacional/de negócio sutil | **Opus 5, esforço alto** para o RPC de Nível 2; Sonnet 5 para o resto | Regra de negócio errada aqui é silenciosa até virar bug de produção |
| 4 — Scanner web | Reconexão de I/O, bibliotecas já prontas | **Sonnet 5**, esforço padrão | — |
| 5 — Stripe/billing | Padrão bem documentado | **Sonnet 5**, esforço padrão; atenção redobrada no webhook para idempotência | — |
| 6 — Scaffold Expo | Exploratório/depuração Metro/Hermes | **Sonnet 5**, esforço padrão | — |
| 7 — Spike de OCR nativo | Julgamento comparativo (ML Kit vs. Vision) | **Opus 5, esforço alto**, escopo pequeno e isolado | Decisão cara de reverter depois |
| 7 (resto) — orquestração nativa | Mecânico, uma vez validado o spike | **Sonnet 5**, esforço padrão | — |
| 8/9 — Compliance de loja | Checklist preciso + Sign in with Apple | **Sonnet 5**, esforço padrão | Bem documentado, não exige o raciocínio das Fases 1/3/7 |
| 10 — Pipeline EAS | Config repetitivo | **Sonnet 5**, esforço padrão | — |

Regra geral: **Opus 5 em esforço alto nos três pontos onde um erro é caro e silencioso** — desenho
de RLS (Fase 1), porte da Completion Authority (Fase 3), e a escolha de engine de OCR nativo (spike
da Fase 7). Sonnet 5 em esforço padrão para todo o resto.

## 7. Verificação

- **Fase 0:** CI verde bloqueando merge de fato.
- **Fase 1:** suíte de isolamento cross-tenant rodando no CI. `/security-review` no diff completo
  de auth+RLS antes de considerar a fase fechada.
- **Fase 2/4:** testes unitários portados junto com cada pacote (o AppScanner tinha 57 arquivos de
  teste Vitest — portar os relevantes por pacote).
- **Fase 3:** teste de regressão específico para `act1_canonical_state_authority` cobrindo WIP,
  dependências não concluídas, evidência não validada.
- **Fase 6/7:** dispositivo físico Android e iOS, não só emulador/simulador.
- **Fase 8/9:** checklist de Data Safety/Privacy Nutrition Labels revisado contra o inventário real
  de dados coletados antes de submeter.
