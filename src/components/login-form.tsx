"use client";

import { useState, type FormEvent } from "react";
import { inMemoryPersistence, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { getFirebaseAuth } from "@/lib/firebase-client";

function authErrorMessage(error: unknown) {
  const code = typeof error === "object" && error !== null && "code" in error && typeof error.code === "string"
    ? error.code
    : "";

  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "E-posta veya şifre hatalı.";
  }
  if (code === "auth/too-many-requests") return "Çok fazla deneme yapıldı. Bir süre sonra yeniden deneyin.";
  if (code === "auth/network-request-failed") return "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.";
  if (error instanceof Error && error.message === "Firebase web yapılandırması eksik.") {
    return "Firebase Authentication yapılandırması henüz tamamlanmamış.";
  }
  return "Giriş yapılamadı. Bilgilerinizi kontrol edip yeniden deneyin.";
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    let auth: ReturnType<typeof getFirebaseAuth> | null = null;
    try {
      auth = getFirebaseAuth();
      await setPersistence(auth, inMemoryPersistence);
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await credential.user.getIdToken();
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ idToken }),
      });

      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const serverMessage =
          typeof result === "object" && result !== null && "error" in result && typeof result.error === "string"
            ? result.error
            : "Oturum açılamadı.";
        setErrorMessage(serverMessage);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setErrorMessage(authErrorMessage(error));
    } finally {
      if (auth) await signOut(auth).catch(() => undefined);
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="form-field">
        <span>E-posta adresi</span>
        <input
          autoComplete="username"
          onChange={(event) => setEmail(event.currentTarget.value)}
          required
          type="email"
          value={email}
        />
      </label>
      <label className="form-field">
        <span>Şifre</span>
        <input
          autoComplete="current-password"
          onChange={(event) => setPassword(event.currentTarget.value)}
          required
          type="password"
          value={password}
        />
      </label>
      <p aria-live="polite" className="auth-error" role={errorMessage ? "alert" : "status"}>
        {errorMessage}
      </p>
      <button className="form-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Giriş yapılıyor…" : "Giriş yap"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
