"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type DeleteRequestButtonProps = {
  requestId: string;
};

export default function DeleteRequestButton({ requestId }: DeleteRequestButtonProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function openDialog() {
    setErrorMessage("");
    dialogRef.current?.showModal();
  }

  async function confirmDelete() {
    setIsDeleting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/admin/requests/${encodeURIComponent(requestId)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null);
        const serverMessage =
          typeof result === "object" && result !== null && "error" in result && typeof result.error === "string"
            ? result.error
            : "Talep silinemedi. Lütfen yeniden deneyin.";
        setErrorMessage(serverMessage);
        return;
      }

      dialogRef.current?.close();
      router.refresh();
    } catch {
      setErrorMessage("Sunucuya ulaşılamadı. Bağlantınızı kontrol edip yeniden deneyin.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        aria-label="Talebi sil"
        className="admin-delete-trigger"
        onClick={openDialog}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M10 11v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3" />
        </svg>
      </button>
      <dialog
        aria-labelledby={`delete-request-title-${requestId}`}
        className="delete-request-dialog"
        onCancel={() => setErrorMessage("")}
        ref={dialogRef}
      >
        <section className="delete-request-content">
          <button
            aria-label="Kapat"
            className="delete-request-close"
            disabled={isDeleting}
            onClick={() => dialogRef.current?.close()}
            type="button"
          >
            ×
          </button>
          <span aria-hidden="true" className="delete-request-mark">!</span>
          <h2 id={`delete-request-title-${requestId}`}>Talep kalıcı olarak silinsin mi?</h2>
          <p>
            Bu işlem geri alınamaz. <strong>{requestId}</strong> numaralı talep veritabanından kalıcı olarak silinecek.
          </p>
          {errorMessage ? <p className="delete-request-error" role="alert">{errorMessage}</p> : null}
          <div className="delete-request-actions">
            <button
              className="delete-request-cancel"
              disabled={isDeleting}
              onClick={() => dialogRef.current?.close()}
              type="button"
            >
              İptal
            </button>
            <button
              className="delete-request-confirm"
              disabled={isDeleting}
              onClick={confirmDelete}
              type="button"
            >
              {isDeleting ? "Siliniyor…" : "Eminim"}
            </button>
          </div>
        </section>
      </dialog>
    </>
  );
}
