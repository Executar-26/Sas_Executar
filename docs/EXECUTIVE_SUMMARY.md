# EXECUTAR — Resumo Executivo do Projeto

**Para:** o agente de IA que assumir este projeto, em qualquer sessão futura.
**Data:** 20/08/2026. **Extensão-alvo:** ~1.000 palavras.

## O que é o EXECUTAR

O EXECUTAR é um produto de planejamento e execução navegável — `Plano → Epic → Entregável →
Tarefa`, com scanner físico de documentos (câmera, OCR, QR), emissão impressa e um servidor MCP
para agentes externos. O produto existe hoje em `Executar-26/Executar-app-scanner`, funcional e
com domínio tecnicamente sólido, mas construído sobre uma fundação de identidade e multiusuário
que não suporta produção pública. Este documento resume três frentes de trabalho que convergem no
mesmo objetivo — tornar o EXECUTAR um produto público, multiusuário e distribuível — e diz
explicitamente onde a responsabilidade de engenharia termina e onde começa uma decisão que só o
dono do produto pode tomar.

## Frente 1 — Por que existe um repositório novo (`Sas_Executar`)

Uma auditoria de prontidão de produção do AppScanner (`docs/audits/PRODUCTION_READINESS_AUDIT.md`,
no repo `Executar-26/Executar`) encontrou identidade 100% anônima sem conta durável, RLS de dono
único (`owner_id = auth.uid()`) nas 34 tabelas — ou seja, zero modelo de colaboração —, CI que
falhou por dias sem bloquear merge, rate limiting em memória, e zero observabilidade de erro em
produção. O código de domínio em si foi julgado sólido; a camada de identidade e operação, não.

A decisão foi reconstruir essa fundação num repositório novo, `Executar-26/Sas_Executar`, usando
Supabase (Auth real, RLS, Storage) como base de dados/identidade e o padrão de schema
`teams`/`team_members`/`invitations` do `nextjs/saas-starter` como forma — mas com um predicado de
autorização único (`is_team_member(team_id)`), não 34 políticas repetidas. O plano completo está em
[`docs/PLAN.md`](./PLAN.md): 11 fases, da fundação de CI/auth/RLS (Fase 0-1) até distribuição
Android **e** iOS via Expo (Fases 6-10) — a PWA/TWA atual não alcança a App Store, e o produto quer
as duas lojas. Duas PRs já fecharam a Fase -1 (scaffold do monorepo + primeira migration de
`teams`). A pendência manual conhecida é ligar branch protection no GitHub — nenhuma ferramenta
desta sessão cobre essa configuração.

## Frente 2 — A matriz de produto do AppScanner (SCHEMA V2.2 · P0 FINAL)

Paralelamente à reconstrução de infraestrutura, existe um contrato de produto mais recente para o
próprio AppScanner, formalizado em 19/08/2026 em cinco deliverables-âncora
([`docs/product/`](./product/README.md)): **Canonical Work Model** (uma única autoridade de
estado, hoje parcial), **Adaptive Execution Dispatcher** (seleção determinística da próxima ação
válida, já parcialmente implementado), **Cycle 72 Execution Contract** (a unidade repetível de
execução — três blocos diários, três workflows Prepare→Execute→Verify), **UX/UI Acceptance
Contract** (critérios verificáveis de acessibilidade e clareza) e **Fractal Design System**
(tokens→primitives→components inspirado em Fluent 2). Das 100 features/requisitos catalogados
contra esse contrato, 46 caem em P0, 50 em P1, 4 em P2 — a única linha em P2 com dependência
*externa* (não do próprio AppScanner) é `Colaboração`/"Share", que depende diretamente da Fase 1
de `Sas_Executar`. É o único ponto de acoplamento real entre as duas frentes: o AppScanner pode
evoluir seu contrato de domínio (Frentes 1-5) quase inteiramente sem esperar o SaaS novo, exceto
onde a feature *é*, por definição, multiusuário.

Preenchi nesta matriz apenas as cinco colunas que são responsabilidade de engenharia/entrega
(`delivery_tier`, `delivery_order`, `depends_on`, `definition_of_done`, `acceptance_criteria`),
derivadas do texto que cada linha já trazia sobre si mesma — não inventado solto. As colunas de
correlação clínica (déficit de função executiva do TDAH, fonte científica, classe epistêmica)
continuam `PENDING_RESEARCH`, deliberadamente: exigem literatura clínica real por linha, e
fabricá-las seria pior do que deixá-las em aberto. Essa fronteira é a mesma já registrada para o
checklist de entrypoint (`docs/checklist/`): Domínio 1 (negócio/clínico) fica com o dono do
produto; Domínio 2 em diante (arquitetura, implementação, operação) é onde este agente atua.

## Frente 3 — As duas pesquisas anexadas, e o que elas confirmam

**OPS-CAP-001** avaliou a viabilidade de um motor de capacidade que converte execução atômica
observada em previsão probabilística de conclusão (P50/P75/P85/P95). A conclusão central: a
computação é barata — Monte Carlo sobre um histórico de throughput é um problema estatístico
pequeno, sem necessidade de GPU ou modelo treinado no núcleo. O risco real está em três pontos
não-computacionais: (1) normalizar a unidade de trabalho (um "EB" não vale sempre o mesmo esforço
cognitivo — a pesquisa recomenda preservar ao menos uma classe operacional por ação, não tratar
todas como equivalentes); (2) telemetria de qualidade suficiente para derivar `cycle_time`/
`active_time` de eventos reais, não só de um campo `DONE`; (3) não deixar a métrica de capacidade
virar métrica de vigilância — o produto avalia o plano, não a pessoa. Isso conecta diretamente ao
domínio `Capacidade` já presente na matriz de produto (RF-025, hoje um filtro de elegibilidade no
dispatcher) e ao próprio `Cycle 72 Execution Contract`.

**REV-MODEL-003** modelou TAM/SAM/SOM para trabalhadores brasileiros neurodivergentes, usando
prevalência publicada de TDAH (2,5%-5,8%) sobre a população ocupada do IBGE e benchmarks reais de
conversão de apps de assinatura (RevenueCat 2026). Com um SAM conservador de ~653 mil trabalhadores
solo com TDAH, o cenário base (10% de alcance, 2,1% de conversão paga) chega a ~1.371 assinantes e
MRR ≈ R$53 mil; o cenário forte chega a ~R$286 mil MRR. A conclusão explícita da pesquisa: o
tamanho de mercado não parece ser o gargalo — o risco migra para aquisição, ativação e retenção,
que só dados reais pós-lançamento vão calibrar. Isso não é responsabilidade de engenharia, mas
informa por que a Fase 1 do plano (identidade durável, upgrade anônimo→registrado) importa: sem
conta persistente, não existe cohort para medir retenção nenhuma.

**DATA-ADHD-PM-001** mapeou 11 funções de gestão de projetos (`GP-01` Iniciação/escopo a `GP-11`
Capacidade/forecasting) contra literatura clínica real (NIMH, PubMed, PMBOK® Guide 8, NICE NG87),
com classe de evidência explícita por função — nunca `A` (observado no EXECUTAR), sempre `B`/`C`
(associação clínica geral publicada) para a vulnerabilidade, e `E · Inferido` para qualquer
conclusão de design. A tese sustentada: gestão de projetos convencional exige planejamento,
memória prospectiva, atenção sustentada, gestão de tempo e autocontrole — domínios em que TDAH
pode, heterogeneamente, gerar atrito —, e uma arquitetura que externalize essas operações *pode*
reduzir essa fricção, sem que isso já esteja validado empiricamente para o EXECUTAR. Usei essa
matriz para preencher as colunas clínicas de [`docs/product/`](./product/README.md): 62 das 100
linhas de feature/requisito mapeiam a alguma função `GP-0X`; 38 são infraestrutura sem correlação
direta e foram marcadas como tal, sem forçar uma ligação que a pesquisa não sustenta.

## Síntese para o próximo agente

As três frentes (infraestrutura, matriz de produto, pesquisas de mercado/clínica) não competem
por prioridade — elas resolvem camadas diferentes do mesmo problema.
A ordem tecnicamente correta, sem otimismo: (1) fechar a Fase 0-1 de `Sas_Executar` (CI real,
identidade durável, RLS multiusuário) porque é pré-requisito estrutural tanto para o SaaS quanto
para qualquer feature de colaboração do AppScanner; (2) avançar os 46 itens P0 da matriz de produto
em paralelo, já que a maioria não depende do SaaS; (3) só depois disso instrumentar o motor de
capacidade (OPS-CAP-001) e usar dados reais de cohort para substituir os priors de conversão de
REV-MODEL-003 por números observados. Nenhuma dessas três frentes autoriza pular a outra — Android/
App Store, em particular, continua condicionado aos Gates Público e Multiusuário do
[`docs/PLAN.md`](./PLAN.md), não o contrário.
