import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("Firebase Admin CommonJS runtime compatibility", () => {
  it("loads Auth and verifies JWKS signatures without require(ESM)", () => {
    const output = execFileSync(process.execPath, [
      "--no-experimental-require-module",
      "-e",
      `
        const assert = require("node:assert/strict");
        const { generateKeyPairSync } = require("node:crypto");
        require("firebase-admin/auth");
        require("firebase-admin/firestore");
        const jwksClient = require("jwks-rsa");
        const jwt = require("jsonwebtoken");
        const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
        const jwk = { ...publicKey.export({ format: "jwk" }), kid: "runtime-test", use: "sig", alg: "RS256" };
        const client = jwksClient({
          jwksUri: "https://unused.example.test/keys",
          getKeysInterceptor: async () => [jwk],
        });
        (async () => {
          const key = await client.getSigningKey(jwk.kid);
          const token = jwt.sign({ sub: "runtime-test" }, privateKey, { algorithm: "RS256", keyid: jwk.kid });
          assert.equal(jwt.verify(token, key.getPublicKey(), { algorithms: ["RS256"] }).sub, "runtime-test");
          const parts = token.split(".");
          parts[1] = Buffer.from(JSON.stringify({ sub: "tampered" })).toString("base64url");
          assert.throws(() => jwt.verify(parts.join("."), key.getPublicKey(), { algorithms: ["RS256"] }));
          console.log("runtime-compatible");
        })().catch(() => { process.exitCode = 1; });
      `,
    ], { encoding: "utf8", timeout: 15_000 });

    expect(output.trim()).toBe("runtime-compatible");
  });
});
