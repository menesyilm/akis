# AI decision log

## 2026-10-01 — Firebase server configuration groundwork

- Request: prepare Firebase configuration before continuing with the landing page; do not put service account keys into the repository.
- User provided Firebase Web app configuration. Decision: keep the planned Firestore write path server-only with Firebase Admin SDK. The Web SDK configuration is public, but it does not authenticate the trusted server write path; Analytics is outside the agreed scope.
- Added a server-only Admin SDK initializer that reads `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` at runtime and accepts escaped `\\n` newlines. It fails clearly when required settings are missing.
- Added locked-down Firestore rules and a placeholder `.env.example`. Added the example-file exception to `.gitignore`. Added `FIREBASE_PROJECT_ID=enteksisakis` to the ignored local `.env.local` only if it was missing; did not print or commit local environment values.
- Verification: inspected the edited files and ignore rules. No tests, lint, or build were run. A Firebase service account has not yet been configured, and no Firestore write has been verified.
- Environment note: the working tree showed `firebase` (Web SDK) added to `package.json` and `package-lock.json` while this task was in progress. Those changes were preserved; their provenance was not established, and this setup currently uses Firebase Admin SDK.
