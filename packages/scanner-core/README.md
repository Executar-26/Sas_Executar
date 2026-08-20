# @sas-executar/scanner-core

**Fase:** 2 (portável como está — o único pedaço do scanner que é 100% multiplataforma).
**Origem:** `Executar-26/Executar-app-scanner`, `src/scanner/roi.ts`, `src/scanner/stabilizer.ts`.

Geometria de ROI (região de interesse) a partir de coordenadas normalizadas, e
`TemporalStabilizer`/`CooldownGate` (confirmação por N frames consecutivos + debounce). Zero
dependência de Canvas, WASM, ou qualquer API de browser/nativa — por isso é o único pacote de
scanner reusado tanto por `@sas-executar/scanner-web` (Fase 4) quanto por
`@sas-executar/scanner-native` (Fase 7).
