"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

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
type SubmissionState = "idle" | "submitting" | "success" | "error";

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
  const [statusMessage, setStatusMessage] = useState("");
  const [requestId, setRequestId] = useState("");

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;
    const fieldName = name as FieldName;
    setValues((current) => ({ ...current, [fieldName]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[fieldName];
      return next;
    });
    if (submissionState === "error" || submissionState === "success") {
      setSubmissionState("idle");
      setStatusMessage("");
      setRequestId("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setStatusMessage("");
    setRequestId("");

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
      setSubmissionState("error");
      setStatusMessage("Lütfen işaretli alanları kontrol edin.");

      const firstInvalidField = Object.keys(nextErrors)[0] as FieldName | undefined;
      if (firstInvalidField) document.getElementById(fieldIds[firstInvalidField])?.focus();
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

      const result: unknown = await response.json();
      if (
        response.status !== 201 ||
        typeof result !== "object" ||
        result === null ||
        !("success" in result) ||
        result.success !== true ||
        !("requestId" in result) ||
        typeof result.requestId !== "string" ||
        result.requestId.length === 0
      ) {
        throw new Error("Request could not be confirmed.");
      }

      setRequestId(result.requestId);
      setSubmissionState("success");
      setStatusMessage("Talebiniz kaydedildi.");
    } catch {
      setSubmissionState("error");
      setStatusMessage(
        "Talebinizin kaydedildiği doğrulanamadı. Ağ hatasında kayıt oluşmuş olabilir; tekrar göndermeden önce kontrol edin.",
      );
    } finally {
      window.clearTimeout(timeoutId);
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

      <div
        aria-live={submissionState === "error" ? "assertive" : "polite"}
        className="form-status"
        role={submissionState === "error" ? "alert" : "status"}
      >
        {submissionState === "success" ? (
          <>
            {statusMessage} Kayıt numarası: <strong>{requestId}</strong>
          </>
        ) : statusMessage}
      </div>
    </form>
  );
}
