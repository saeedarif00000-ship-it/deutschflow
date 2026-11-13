# DeutschFlow — AI German learning app (A1 → C1)

React Native + Expo (SDK 58, Expo Router) app for iOS & Android, plus a zero-dependency Node backend for AI, accounts and sync.

## Run it

```bash
npm install
npx expo start            # Expo Go: everything except voice input
```

Voice input (speech recognition) is a native module, so it needs a **development build**:

```bash
npx eas-cli@latest build --profile development --platform android   # or ios
npx expo start --dev-client
```

Without it the app falls back to typed input everywhere. TTS (German voices) works in Expo Go.

### AI server (optional but recommended)

```bash
cd server
cp .env.example .env      # add ANTHROPIC_API_KEY
npm start                 # Node ≥ 22.13, listens on :8787
```

In the app: **Settings → AI server** → enter `http://<your-computer-LAN-IP>:8787` → *Save & test*.
The API key never leaves the server. Without a server the app runs fully offline: scripted conversation scenarios, rule-based corrections, built-in passages rotating daily.

## Features

| Area | What works |
|---|---|
| **Vocabulary notifications** | Pre-scheduled local notifications every 2/3/5/10/15/30 min, each containing a real word card; quiet hours; tap → word card. Queue topped up on every app open (iOS 64-pending limit respected; Android best-effort delivery, no exact-alarm permission). |
| **Word Flow** | In-app mode with an exact interval timer, new words + due reviews interleaved, auto-pronunciation. |
| **Word cards** | Article (colour-coded der/die/das), plural, verb forms (Präsens/Präteritum/Perfekt), phonetics, TTS, 2 examples + translations, usage, common mistakes, synonyms/antonyms, word family, "Why do Germans say it?" (AI). 1,290+ words (A1 174 · A2 425 · B1 352 · B2 329 · C1 13); core words have hand-written phonetics, the rest approximate respellings (marked ≈) plus audio. |
| **Spaced repetition** | SM-2 variant (Again/Hard/Good/Easy with interval previews); mastered/difficult/due tracking; games feed the schedule. |
| **Levels A1–C1** | Level-weighted word selection by frequency + preferred topics; grammar and reading per level. |
| **Reading** | 27 passages A1–B2 + daily passage; tap-to-translate, sentence-by-sentence, colour-coded word-by-word (POS), grammar notes, key vocab, comprehension questions; AI-generated new passages. |
| **Grammar** | 26 lessons (articles → Konjunktiv I, incl. reflexive verbs, zu-infinitive, verbs with prepositions, Plusquamperfekt, Futur, two-part connectors, n-declension, participles, nominal style, passive alternatives) with tables, audio examples, MC / fill-in / sentence-order exercises, "Ask your AI teacher". |
| **Speaking** | AI conversation at any level or topic, 6 simulator scenarios (restaurant, doctor, landlord, office hours, job interview, Bürgeramt), waits for you to finish, corrections in English at the end (or collapsed per message), more-natural phrasing. Pronunciation trainer with similarity scoring. |
| **Games** | Daily Quiz, Word Matching, Article Challenge, Sentence Builder, Fill in the Blanks, Listening, Speed (60 s), Grammar Battle (lives + combos), Memory, Conversation Simulator. XP, levels, streaks, 11 achievements. |
| **AI personal teacher** | Tracks words, grammar accuracy per topic, mistakes, reading, speaking time; daily plan re-prioritises weak topics (e.g. Dativ); profile sent with every AI request. |
| **Progress** | Learned/mastered/to-revise, grammar, passages, speaking minutes, quiz average, 7/30-day activity chart, CEFR estimate, strengths & weaknesses. |
| **Translator** | German ⇄ English: word-by-word offline (98% coverage of the app's texts), full sentences via the AI server. |
| **Extras** | Mistake notebook, saved-words notebook, word-family explorer, slang & idioms with "why", immersion mode (UI gradually switches to German), dark/light/system theme, offline-first storage, account + cloud sync. |

## Structure

```
src/app/            screens (Expo Router) — (tabs)/ = 7 main tabs
src/components/     UI kit, word card, exercise renderer
src/data/           vocab, grammar, readings, scenarios (typed; AI can append)
src/lib/            store (zustand + AsyncStorage), srs, learning/planner,
                    notifications, speech (TTS/STT), ai (+offline tutor), sync, i18n
server/src/server.mjs   auth, SQLite sync, /ai/chat|correct|explain|reading|words
```

## Notes on notification reliability

Neither iOS nor Android lets an app run code every 2–3 minutes in the background. DeutschFlow therefore schedules a batch of up to 60 (iOS) / 50 (Android) notifications ahead with the word content baked in, skips quiet hours, and refills whenever the app returns to the foreground. If you don't open the app for a few hours the batch can run out — Word Flow is the exact, unrestricted mode.
