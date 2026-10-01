import { redirect } from "next/navigation";
import Link from "next/link";

import LoginForm from "@/components/login-form";
import { getVerifiedAdminSession } from "@/lib/server/admin-session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getVerifiedAdminSession();
  if (session) redirect("/admin");

  return (
    <main className="auth-page">
      <Link className="brand auth-brand" href="/" aria-label="Akış ana sayfa">
        <span className="brand-mark" aria-hidden="true">a<span>.</span></span>
        <span>akış</span>
      </Link>
      <section aria-labelledby="login-title" className="auth-card">
        <p className="eyebrow"><span /> YÖNETİCİ GİRİŞİ</p>
        <h1 id="login-title">Yeniden <em>hoş geldiniz.</em></h1>
        <p className="auth-intro">Talepleri görüntülemek için yönetici hesabınızla giriş yapın.</p>
        <LoginForm />
      </section>
      <Link className="auth-back-link" href="/">← Ana sayfaya dön</Link>
    </main>
  );
}
