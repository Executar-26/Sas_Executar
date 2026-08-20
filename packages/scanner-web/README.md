# @sas-executar/scanner-web

**Fase:** 4 (portável como está, só web).
**Origem:** `Executar-26/Executar-app-scanner`, `src/scanner/camera.ts`,
`image-preprocessor.ts`, `frame-sampler.ts`, `ocr.ts`, `zxing-qr.ts`.

Pipeline de câmera+reconhecimento no browser:

- `camera.ts` — wrapper de `getUserMedia` com lease compartilhado a nível de módulo (evita
  flash de câmera duplo em remounts do React).
- `image-preprocessor.ts` — captura Canvas 2D + binarização por limiar de Otsu, feito à mão.
- `frame-sampler.ts` — orquestra ROI (de `@sas-executar/scanner-core`) + preprocessamento por
  frame de vídeo.
- `ocr.ts` — wrapper do **Tesseract.js** (worker + WASM, carregado sob demanda no primeiro
  `recognize()` — padrão correto de lazy-load).
- `zxing-qr.ts` — leitor QR via **zxing-wasm**.

**Nunca importado por `apps/mobile`** — depende de `getUserMedia`/Canvas2D/WebAssembly, que não
existem (ou não da mesma forma) em React Native/Hermes. Ver `@sas-executar/scanner-native` para o
equivalente nativo.
