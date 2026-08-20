# Contribuindo

Este documento é sobre *como* trabalhar neste repositório — o *quê* e *por quê* de cada fase está
em [`docs/PLAN.md`](./docs/PLAN.md). Leia o plano antes deste arquivo se ainda não leu.

## Branches

- `main` é o chassi — protegido (ver pendência de branch protection no README), nunca recebe
  commit direto.
- Um branch por unidade de trabalho, nomeado pelo tipo + o que muda:
  `feat/`, `fix/`, `chore/`, `docs/` — ex.: `feat/fase-1-teams-rls`,
  `fix/ci-pnpm-version-conflict`.
- Referencie a fase do plano no nome do branch ou no título do PR quando o trabalho corresponder
  a uma (`docs/PLAN.md` §5) — facilita saber, olhando só a lista de PRs, em que pé cada fase está.

## Commits

Convenção [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`,
`docs:`, `refactor:`, `test:`) na primeira linha; corpo explica o *porquê*, não repete o *o quê*
que o diff já mostra. Mensagens neste repositório até agora seguem esse padrão — use-as como
referência de tom (`git log`).

## Pull Requests

- CI (`install → typecheck → lint → test → build`) tem que estar verde antes de pedir revisão —
  não abra PR sabendo que vai quebrar, ver a seção de Workflows do README para o estado da branch
  protection.
- Todo RPC de Nível 2/3 (`docs/PLAN.md` §3.2) leva seu teste de isolamento cross-tenant no mesmo
  PR que o cria — não é aceitável adiar isso para "depois".
- Mudança de RLS/auth passa por `/security-review` (ou `/code-review --level=high`) no diff antes
  do merge, independentemente de quem/qual modelo escreveu o código — ver `docs/PLAN.md` §6 para
  quando isso é obrigatório (Fases 1 e 3 especificamente).
- PR descreve o que muda e por quê, como foi verificado (comandos rodados, não só "rodei os
  testes"), e se toca banco/auth/segredo.

## Modelo e esforço no Claude Code

`docs/PLAN.md` §6 tem a tabela completa por fase. Resumo: Opus 5 em esforço alto só nos três
pontos onde um erro é caro e silencioso (desenho de RLS na Fase 1, porte da Completion Authority
na Fase 3, escolha de engine de OCR nativo no spike da Fase 7) — Sonnet 5 em esforço padrão para
todo o resto.

## Estrutura de pacote novo

Ao adicionar um pacote em `packages/*`:

1. `package.json` com `name: "@sas-executar/<nome>"`, `private: true`, e os scripts
   `build`/`lint`/`test`/`typecheck` — mesmo que só um placeholder até o pacote ganhar código real
   (siga o padrão dos pacotes existentes: `echo` explícito dizendo qual fase falta, não um script
   vazio silencioso).
2. `README.md` dizendo de onde vem o código (arquivo/caminho no AppScanner original, se aplicável)
   e em qual fase do plano ele é preenchido.
3. Adicionar ao `pnpm-workspace.yaml` só se estiver fora do padrão `apps/*`/`packages/*` já
   coberto (normalmente não precisa tocar esse arquivo).
