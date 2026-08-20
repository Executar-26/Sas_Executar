# @sas-executar/scanner-native

**Fase:** 7 (novo — maior incerteza de todo o plano, ver `docs/PLAN.md` §5/§6).
**Origem conceitual:** `Executar-26/Executar-app-scanner`, orquestração de
`fast-folder-detector.ts`, `symbol-command-detector.ts`, `symbol-command-watcher.ts`,
`scanner-controller.ts` — a *máquina de estado* porta, as chamadas de captura/reconhecimento não.

**Por que não é porte mecânico:** Hermes (engine JS do React Native) não implementa
`WebAssembly` (facebook/hermes#429, em aberto). `tesseract.js` e `zxing-wasm` — ambos WASM —
não rodam em React Native. Este pacote substitui:

- Câmera: `expo-camera` (em vez de `getUserMedia`).
- QR: **barcode scanning nativo embutido do `expo-camera`** (`onBarcodeScanned`) — mais simples
  que a versão web, nenhuma lib extra necessária. Backend: ML Kit no Android,
  `DataScannerViewController` no iOS.
- OCR: ML Kit (Android) / Vision framework (iOS) via um pacote de Expo Modules da comunidade — a
  decidir no spike da Fase 7 (nenhum candidato foi comprometido ainda; ver `docs/PLAN.md`).
- Pré-processamento: `expo-image-manipulator` para crop/resize/rotate — **sem equivalente nativo
  pronto para deskew/binarização** (o que `image-preprocessor.ts` faz no web via Canvas2D/Otsu).
  Decisão em aberto: portar esse algoritmo para Skia ou aceitar OCR pior em captura torta.

**Recomendação do plano:** fazer um spike isolado (fora do app completo) comparando ML Kit vs.
Vision antes de comprometer esta fase inteira — é a decisão mais cara de reverter depois de
construída em cima.
