# Signal — Frontend for `email-service`

A React (Vite + Tailwind) frontend built specifically against your uploaded
`email-service` backend. It talks to your existing routes as-is — nothing in
the backend was changed.

## Running it

**1. Start your backend** (in the `email-service` folder you uploaded):

```bash
npm install
node server.js
```

It listens on `http://localhost:3000` (hardcoded in `server.js`). Make sure
`.env` has `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY` (for AI drafting), and
`EMAIL_USER` / `EMAIL_PASS` (for actually sending campaigns via Gmail SMTP).

**2. Start this frontend**, in a separate terminal:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. `vite.config.js` proxies every `/api/*` request
to `http://localhost:3000`, so the browser sees everything as same-origin —
this is why the backend didn't need CORS added.

**3. Build for production:**

```bash
npm run build
```

Outputs static files to `dist/`. Since the backend has no CORS headers, a
production deployment needs either (a) both served from the same origin
behind one reverse proxy, or (b) `cors()` added to `src/app.js`.

## How this maps to your actual backend

I read through your controllers/models/services and built the UI to match
what's really there, not the original feature list verbatim:

| Feature | What exists in `email-service` | What the frontend does |
|---|---|---|
| Auth | JWT via `/api/auth/register`, `/api/auth/login`. Login only returns a token (no user object). | Frontend decodes the JWT payload (`{id, email}`) client-side to know who's logged in. |
| Subscribers | `name`, `email`, `status` (`active`/`unsubscribed`/`bounced`), scoped by `creatorId` = the logged-in user's id. | Full CRUD + CSV import UI, matching those exact fields. |
| CSV import | `subscriberService.js` expects **exactly** `name` and `email` columns; silently skips missing/invalid/duplicate rows. | Import modal states this format explicitly and offers a sample CSV download. |
| Campaigns | Just `subject`, `content`, `status` (`draft`/`scheduled`/`sending`/`sent`), `sentAt`. No separate template model. | AI drafting is built into the campaign compose form directly (no separate "templates" section, since the backend has no such entity). |
| AI generation | `/api/ai/generate` (Gemini, via `@google/generative-ai`) takes a single `prompt` string and returns `{subject, content}`. Its internal prompt **hardcodes "Professional tone"**. | The frontend lets you pick a tone and a subscriber to personalize for, and folds both into the `prompt` string it sends — but since the backend's own instructions also say "professional tone," results may not fully honor your tone choice. To fix properly, edit the `fullPrompt` template in `src/services/ai.service.js` to accept a tone parameter. |
| Sending | `sendCampaign` loops over all `active` subscribers and calls `nodemailer.sendMail` per recipient, catching failures only with `console.error` — no counts are persisted anywhere. | The campaign detail page sends with a confirmation step, and is upfront that delivered/opened/clicked/failed counts **aren't tracked by the server**, so they aren't shown. |
| Analytics | No stats stored per campaign or per recipient at all. | Built from what's real: subscriber status breakdown, campaign status breakdown, and a "campaigns sent over time" timeline — plus an "AI insights" panel that reuses `/api/ai/generate` with your aggregate counts as the prompt, to produce a written summary/recommendations (not simulated metrics). |

## Two small things worth fixing in the backend (not changed here)

1. **`src/middlewares/upload.middleware.js`** has a typo —
   `file.originialName` should be `file.originalname` (multer's actual
   field). Right now every uploaded CSV gets saved as `<timestamp>-undefined`
   on disk (harmless functionally, since `csv-parser` still reads it before
   it's deleted, but worth fixing for clarity/debugging).
2. **No CORS middleware** in `src/app.js`. Not an issue in local dev thanks
   to the Vite proxy, but will matter the moment frontend and backend are
   deployed on different origins.

## Design

Dark "ink" theme with a violet AI accent, distinct semantic colors for
subscriber/campaign statuses, and a signature "signal flow" bar (the
segmented, gently animated pipeline bar on the dashboard) that visualizes
how your campaigns are distributed across statuses.
