# apps/mobile

Expo Router (SDK 54/55 atual no momento do plano, RN 0.83+/React 19.2) — nasce na Fase 6, **depois**
de `apps/web` estar demonstrável nos Gates Público + Multiusuário (Fase 4), não em paralelo.

Motivo (ver `docs/PLAN.md` §5/§6): o item de maior incerteza de todo o projeto é o porte do OCR
nativo (Fase 7) — a recomendação é fazer um spike isolado dessa peça especificamente antes de
comprometer a construção do app inteiro, em vez de dividir foco entre dois apps completos ao
mesmo tempo.

Compartilha `@sas-executar/domain`, `@sas-executar/fractal`, `@sas-executar/scanner-core`, e os
schemas Zod de `@sas-executar/db` com `apps/web`. **Não compartilha** `@sas-executar/scanner-web`
(Tesseract.js/zxing-wasm — dependem de WASM, que o motor Hermes do React Native não suporta) nem
`@sas-executar/ui` (shadcn/Tailwind são DOM/CSS, não React Native).

Requisitos de loja já mapeados em `docs/PLAN.md` §5 Fases 8-10 (Google Play: API 36, Data Safety,
exclusão de conta, faixa de teste fechado se aplicável; Apple: Sign in with Apple, exclusão de
conta *dentro do app*, Privacy Nutrition Labels, TestFlight).
