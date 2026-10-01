"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { requestSchema } from "@/lib/request-schema";
import { services } from "@/lib/services";

type FormValues = {
  name: string;
  email: string;
  service: string;
  description: string;
};

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;
type SubmissionState = "idle" | "submitting";
type ResultNotice = {
  title: string;
  statusCode: number | null;
  message: string;
  requestId?: string;
  success: boolean;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  service: "",
  description: "",
};

const fieldIds: Record<FieldName, string> = {
  name: "request-name",
  email: "request-email",
  service: "request-service",
  description: "request-description",
};

export default function RequestForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [resultNotice, setResultNotice] = useState<ResultNotice | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const focusAfterDialogClose = useRef<FieldName | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (resultNotice && !dialog.open) {
      dialog.showModal();
    } else if (!resultNotice && dialog.open) {
      dialog.close();
    }
  }, [resultNotice]);

  function closeResultNotice() {
    setResultNotice(null);
  }

  function handleDialogClose() {
    const fieldToFocus = focusAfterDialogClose.current;
    focusAfterDialogClose.current = null;
    if (fieldToFocus) {
      window.requestAnimationFrame(() => document.getElementById(fieldIds[fieldToFocus])?.focus());
    }
  }

  function handleDialogCancel(event: React.SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    closeResultNotice();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;
    const fieldName = name as FieldName;
    setValues((current) => ({ ...current, [fieldName]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[fieldName];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setResultNotice(null);

    const parsed = requestSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const fieldName = issue.path[0];
        if (typeof fieldName === "string" && fieldName in fieldIds) {
          const key = fieldName as FieldName;
          nextErrors[key] ??= issue.message;
        }
      }
      setErrors(nextErrors);
      const firstInvalidField = Object.keys(nextErrors)[0] as FieldName | undefined;
      focusAfterDialogClose.current = firstInvalidField ?? null;
      setResultNotice({
        title: "Doğrulama başarısız",
        statusCode: 400,
        message: Object.values(nextErrors).join(" ") || "İşaretli alanları kontrol edip yeniden deneyin.",
        success: false,
      });
      return;
    }

    setSubmissionState("submitting");
    const abortController = new AbortController();
    const timeoutId = window.setTimeout(() => abortController.abort(), 15_000);

    try {
      const formData = new FormData(event.currentTarget);
      const companyWebsite = String(formData.get("companyWebsite") ?? "");
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, companyWebsite }),
        signal: abortController.signal,
      });

      let result: Record<string, unknown> | null = null;
      try {
        result = (await response.json()) as Record<string, unknown>;
      } catch {
        // Response body was not JSON
      }

      if (response.status === 201 && result && result.success === true && typeof result.requestId === "string" && result.requestId.length > 0) {
        setValues(initialValues);
        setErrors({});
        setSubmissionState("idle");
        setResultNotice({
          title: "Başarılı",
          statusCode: response.status,
          message: "Talebiniz kaydedildi.",
          requestId: result.requestId,
          success: true,
        });
        return;
      }

      // Handle specific HTTP error statuses
      const serverErrorMessage = typeof result?.error === "string" ? result.error : null;
      let title = "İstek başarısız";
      let message: string;
      if (response.status === 400) {
        title = "İstek geçersiz";
        message = serverErrorMessage ?? "Form alanlarını kontrol edip yeniden deneyin.";
      } else if (response.status === 413) {
        title = "İstek çok büyük";
        message = serverErrorMessage ?? "İstek boyutu izin verilen sınırı aşıyor.";
      } else if (response.status === 415) {
        title = "İstek biçimi desteklenmiyor";
        message = serverErrorMessage ?? "İstek JSON biçiminde olmalı.";
      } else if (response.status === 500) {
        title = "Sunucu hatası";
        message = serverErrorMessage ?? "Talebiniz şu anda kaydedilemedi. Lütfen biraz sonra yeniden deneyin.";
      } else {
        message = serverErrorMessage ?? "Beklenmeyen bir yanıt alındı. Lütfen tekrar deneyin.";
      }
      setResultNotice({ title, statusCode: response.status, message, success: false });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setResultNotice({
          title: "İstek zaman aşımına uğradı",
          statusCode: null,
          message: "Sunucudan yanıt alınamadı. Kayıt oluşmuş olabileceğinden tekrar göndermeden önce Firestore'u kontrol edin.",
          success: false,
        });
      } else {
        setResultNotice({
          title: "Bağlantı hatası",
          statusCode: null,
          message: "Sunucuya ulaşılamadı. Kayıt oluşmuş olabileceğinden tekrar göndermeden önce kontrol edin.",
          success: false,
        });
      }
    } finally {
      window.clearTimeout(timeoutId);
      setSubmissionState("idle");
    }
  }

  function fieldProps(field: FieldName) {
    const error = errors[field];
    return {
      "aria-describedby": error ? `${fieldIds[field]}-error` : undefined,
      "aria-invalid": error ? true : undefined,
      id: fieldIds[field],
      name: field,
      onChange: handleChange,
      value: values[field],
    };
  }

  return (
    <>
      <form className="request-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor={fieldIds.name}>Adınız</label>
          <input
            {...fieldProps("name")}
            autoComplete="name"
            maxLength={80}
            placeholder="Adınız ve soyadınız"
            required
            type="text"
          />
          {errors.name && <span className="field-error" id={`${fieldIds.name}-error`}>{errors.name}</span>}
        </div>

        <div className="form-field">
          <label htmlFor={fieldIds.email}>E-posta adresiniz</label>
          <input
            {...fieldProps("email")}
            autoComplete="email"
            maxLength={254}
            placeholder="ornek@firma.com"
            required
            type="email"
          />
          {errors.email && <span className="field-error" id={`${fieldIds.email}-error`}>{errors.email}</span>}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor={fieldIds.service}>Hangi konuda destek arıyorsunuz?</label>
        <select {...fieldProps("service")} required>
          <option value="">Bir hizmet seçin</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
        </select>
        {errors.service && <span className="field-error" id={`${fieldIds.service}-error`}>{errors.service}</span>}
      </div>

      <div className="form-field">
        <label htmlFor={fieldIds.description}>İhtiyacınızı kısaca anlatın</label>
        <textarea
          {...fieldProps("description")}
          maxLength={1000}
          placeholder="Bugün hangi işler tekrar ediyor veya zamanınızı alıyor?"
          required
          rows={4}
        />
        <div className="field-meta">
          {errors.description ? (
            <span className="field-error" id={`${fieldIds.description}-error`}>{errors.description}</span>
          ) : (
            <span>10–1000 karakter</span>
          )}
          <span>{values.description.length}/1000</span>
        </div>
      </div>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="company-website">Bu alanı boş bırakın</label>
        <input autoComplete="off" id="company-website" name="companyWebsite" tabIndex={-1} type="text" />
      </div>

      <button className="form-submit" disabled={submissionState === "submitting"} type="submit">
        {submissionState === "submitting" ? "Gönderiliyor…" : "Talep oluştur"}
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
          <path d="M4 10h11M10 4l6 6-6 6" />
        </svg>
      </button>

      </form>

      <dialog
        aria-labelledby="request-result-title"
        aria-describedby="request-result-message"
        className={`result-dialog${resultNotice?.success ? " result-dialog-success" : ""}`}
        onCancel={handleDialogCancel}
        onClose={handleDialogClose}
        ref={dialogRef}
      >
        {resultNotice && (
          <div className="result-dialog-content">
            <span aria-hidden="true" className="result-dialog-mark">
              {resultNotice.success ? "✓" : "!"}
            </span>
            <div className="result-dialog-heading">
              <h2 id="request-result-title">{resultNotice.title}</h2>
              <span className="result-dialog-code">
                {resultNotice.statusCode === null ? "HTTP yanıtı yok" : `HTTP ${resultNotice.statusCode}`}
              </span>
            </div>
            <p className="result-dialog-message" id="request-result-message">{resultNotice.message}</p>
            {resultNotice.requestId && (
              <div className="result-dialog-request-id">
                <span>Kayıt numarası</span>
                <strong>{resultNotice.requestId}</strong>
              </div>
            )}
            <button autoFocus className="result-dialog-confirm" onClick={closeResultNotice} type="button">
              Tamam
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
