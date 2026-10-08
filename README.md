# CleanItUp

Know Your Waste. Do the Right Thing. — a mobile-first AI waste assistant prototype.

```bash
npm install
npm run dev          # http://localhost:3000
npm run dev -- --experimental-https   # needed for the camera when opening from a phone on your LAN
```

## Architecture

```
Camera / Upload → analyzeImage() (src/features/waste/pipeline.ts)
  → VisionProvider → WasteDetection
  → WasteKnowledgeProvider (+ WasteValueProvider, RecyclerProvider) → WasteKnowledge
  → WasteAgent → WasteAnalysis
  → (on user consent) LocationProvider → RecyclerProvider + WasteValueProvider → localizeAnalysis()
  → UI + Voice + Chat

Voice: SpeechRecognitionProvider → transcript → LanguageDetector → conversation language
  → WasteAgent (phrasebook, 13 languages + romanized Hindi/Punjabi) → SpeechSynthesisProvider
```

Vision/knowledge/agent/recycler/value are mocks, and speech/language use browser APIs and on-device heuristics; all are wired in `src/providers/index.ts`; swap them there for real models/APIs.
Demo data lives in `src/data/`. The mock vision provider classifies by the dominant colour in the
centre of the frame — use "Not right?" on the result to correct it during a demo.
