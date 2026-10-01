import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());
const base = process.argv[2] ?? "https://enteksis-akis.vercel.app";
const expectedCommit = process.argv[3];
const proof = { checkedAt: new Date().toISOString(), base, checks: [] };
async function check(path, expectedStatus, options = {}) {
  const response = await fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(30_000), ...options });
  assert.equal(response.status, expectedStatus, path);
  proof.checks.push({ path, status: response.status });
  return response;
}
await check("/", 200);
const login = await check("/login", 200);
assert.match(await login.text(), /auth-form/);
const admin = await check("/admin", 307);
assert.equal(new URL(admin.headers.get("location"), base).pathname, "/login");
const health = await (await check("/api/health", 200)).json();
if (expectedCommit) assert.equal(health.commit, expectedCommit, "Production commit must match delivery");
proof.commit = health.commit;
await check("/api/requests", 415, { method: "POST", headers: { "content-type": "text/plain" }, body: "invalid" });
await check("/api/requests", 400, { method: "POST", headers: { "content-type": "application/json" }, body: "{invalid-json" });
await check("/api/requests", 413, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ description: "x".repeat(17_000) }) });
await check("/api/requests", 400, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "A", email: "invalid" }) });
await check("/api/admin/requests/proof-test", 401, { method: "DELETE", headers: { origin: new URL(base).origin } });
await check("/api/auth/session", 403, { method: "POST", headers: { origin: "https://other.example.test", "content-type": "application/json" }, body: JSON.stringify({ idToken: "invalid" }) });

const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
let privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
assert.ok(projectId && clientEmail && privateKey, "Local Firebase Admin credentials are required for persistence proof");
if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || (privateKey.startsWith("'") && privateKey.endsWith("'"))) privateKey = privateKey.slice(1, -1);
privateKey = privateKey.replace(/\\n/g, "\n");
const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), projectId }, "delivery-proof");
const database = getFirestore(app);
await database.collection("requests").doc("delivery-proof-preflight").get();
// A synthetic record is intentionally retained as delivery evidence; no existing records are deleted.
const payload = {
  name: "Deneme Kullanıcısı", email: "deneme@example.com", service: "reporting",
  description: `ENTEKSİS teslim doğrulaması — yalnızca kurgusal test verisi. ${proof.checkedAt}`,
};
const saved = await (await check("/api/requests", 201, {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
})).json();
assert.equal(saved.success, true); assert.ok(saved.requestId);
proof.requestId = saved.requestId;
const document = database.collection("requests").doc(saved.requestId);
const first = await document.get();
assert.ok(first.exists);
for (const [key, value] of Object.entries(payload)) assert.equal(first.get(key), value);
assert.equal(first.get("status"), "new"); assert.ok(first.get("createdAt")?.toDate());
await check("/", 200);
const afterReload = await document.get();
assert.ok(afterReload.exists);
assert.equal(afterReload.get("description"), payload.description);
proof.persistence = { firstRead: true, afterReload: true, status: first.get("status"), createdAt: first.get("createdAt").toDate().toISOString() };
await database.terminate();
await writeFile("LIVE_VERIFICATION.json", JSON.stringify(proof, null, 2) + "\n");
console.log(JSON.stringify(proof, null, 2));
