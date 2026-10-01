import { redirect } from "next/navigation";
import Link from "next/link";

import { getVerifiedAdminSession } from "@/lib/server/admin-session";
import { listServiceRequests } from "@/lib/server/request-repository";
import { services } from "@/lib/services";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function serviceLabel(value: string) {
  return services.find((service) => service.id === value)?.title ?? value;
}

function formatDate(value: string | null) {
  if (!value) return "Tarih yok";
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(new Date(value));
}

export default async function AdminPage() {
  let session = null;
  try {
    session = await getVerifiedAdminSession();
  } catch {
    session = null;
  }
  if (!session) redirect("/login");

  let requests = await listServiceRequests().catch(() => null);
  const loadError = requests === null;
  requests ??= [];
  const newCount = requests.filter((request) => request.status === "new").length;

  return (
    <main className="admin-page">
      <header className="admin-header">
        <Link className="brand" href="/" aria-label="Akış ana sayfa">
          <span className="brand-mark" aria-hidden="true">a<span>.</span></span>
          <span>akış</span>
          <span className="admin-brand-label">YÖNETİM</span>
        </Link>
        <div className="admin-header-actions">
          <span className="admin-user-email">{session.email}</span>
          <form action="/api/auth/logout" method="post">
            <button className="admin-logout" type="submit">Çıkış yap <span aria-hidden="true">↗</span></button>
          </form>
        </div>
      </header>

      <section className="admin-content" aria-labelledby="admin-title">
        <div className="admin-page-heading">
          <div>
            <p className="eyebrow"><span /> TALEP MERKEZİ</p>
            <h1 id="admin-title">Gelen <em>talepler.</em></h1>
            <p>İşletmelerin gönderdiği hizmet taleplerini buradan inceleyin.</p>
          </div>
          <div aria-label={`${requests.length} talep, ${newCount} yeni`} className="admin-stats">
            <div><strong>{requests.length}</strong><span>Listelenen</span></div>
            <div><strong>{newCount}</strong><span>Yeni</span></div>
          </div>
        </div>

        {loadError ? (
          <p className="admin-empty admin-load-error" role="alert">Talepler yüklenemedi. Sunucu yapılandırmasını kontrol edip yeniden deneyin.</p>
        ) : requests.length === 0 ? (
          <p className="admin-empty">Henüz kayıtlı bir talep bulunmuyor.</p>
        ) : (
          <div aria-label="Son 100 talep" className="admin-request-list">
            {requests.map((request) => (
              <article className="admin-request-card" key={request.id}>
                <div className="admin-request-topline">
                  <time dateTime={request.createdAt ?? undefined}>{formatDate(request.createdAt)}</time>
                  <span className={`admin-status${request.status === "new" ? " admin-status-new" : ""}`}>
                    {request.status === "new" ? "Yeni" : request.status}
                  </span>
                </div>
                <div className="admin-request-contact">
                  <h2>{request.name}</h2>
                  <a href={`mailto:${request.email}`}>{request.email}</a>
                </div>
                <dl className="admin-request-details">
                  <div>
                    <dt>Hizmet</dt>
                    <dd>{serviceLabel(request.service)}</dd>
                  </div>
                  <div>
                    <dt>Açıklama</dt>
                    <dd>{request.description}</dd>
                  </div>
                  <div>
                    <dt>Kayıt numarası</dt>
                    <dd className="admin-request-id">{request.id}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
        <p className="admin-list-note">En yeni 100 kayıt listelenir.</p>
      </section>
    </main>
  );
}
