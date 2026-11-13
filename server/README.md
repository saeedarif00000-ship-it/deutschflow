# DeutschFlow server

Zero dependencies. Node ≥ 22.13 (uses built-in `node:sqlite`).

```bash
cp .env.example .env   # set ANTHROPIC_API_KEY
npm start
```

| Endpoint | Auth | Purpose |
|---|---|---|
| `GET /health` | – | status, whether AI is configured |
| `POST /auth/register`, `/auth/login` | – | `{email,password}` → `{token,email}` |
| `GET/PUT /sync` | Bearer | load / save progress JSON |
| `POST /ai/chat` | optional* | conversation turn + corrections + suggestions |
| `POST /ai/correct` | optional* | correct a German text |
| `POST /ai/explain` | optional* | free-form grammar / usage question |
| `POST /ai/reading` | optional* | generate a graded passage with glosses & questions |
| `POST /ai/words` | optional* | generate new vocabulary cards |

\* Set `REQUIRE_AUTH_FOR_AI=1` to require sign-in for AI routes (recommended when deployed publicly). Rate limit: 30 AI requests/min per IP.

Deploy anywhere that runs Node (Fly.io, Render, a VPS). Mount `data/` as a persistent volume (SQLite DB + token secret).
