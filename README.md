# Akış — Küçük İşletmeler İçin İş Otomasyonu

Akış, sipariş takibi, otomatik raporlama ve görev/hatırlatma süreçlerini dijitalleştirmek isteyen küçük işletmeler için geliştirilmiş modern bir otomasyon talep platformudur. Ziyaretçiler ihtiyaçlarını landing page üzerinden seçip talep oluşturabilir; yöneticiler ise güvenli yönetim panelinden gelen talepleri anlık olarak inceleyebilir ve yönetebilir.

---

## 🌐 Canlı Bağlantılar

| Sayfa | Canlı URL (Vercel) | Açıklama |
|---|---|---|
| **Ana Sayfa (Landing Page)** | [https://enteksis-akis.vercel.app](https://enteksis-akis.vercel.app) | Hizmet tanıtımı, süreç adımları ve etkileşimli talep formu |
| **Yönetici Girişi** | [https://enteksis-akis.vercel.app/login](https://enteksis-akis.vercel.app/login) | Firebase Auth ile korumalı yönetici giriş ekranı |
| **Yönetim Paneli** | [https://enteksis-akis.vercel.app/admin](https://enteksis-akis.vercel.app/admin) | Gelen taleplerin listelendiği ve yönetildiği güvenli panel |
| **Kaynak Kod (GitHub)** | [https://github.com/menesyilm/akis](https://github.com/menesyilm/akis) | Açık incelemeye açık GitHub deposu |

---

## 🚀 Teknoloji Yığını

- **Framework:** Next.js 16 (App Router, Node.js Runtime, Server & Client Components)
- **Dil:** TypeScript 5
- **Stil & Tasarım:** Tailwind CSS v4, Akış özel renk paleti (`#1B2923`, `#CFED69`, `#99A579`, `#F5F5EF`)
- **Animasyonlar:** Framer Motion (Scroll reveal re-trigger, spring hover & stagger efektleri)
- **Doğrulama:** Zod (İstemci ve sunucu tarafında ortak tip güvenli şema doğrulaması)
- **Veritabanı:** Firebase Firestore (Sunucu taraflı güvenli kalıcı kayıt)
- **Kimlik Doğrulama:** Firebase Authentication (Admin oturumu + `HttpOnly` güvenli cookie)
- **Sunucu SDK:** Firebase Admin SDK (`server-only` mimarisiyle izole)
- **Test:** Vitest (14/14 birim ve API entegrasyon testi)
- **Dağıtım & Analitik:** Vercel + Vercel Analytics

---

## ⚙️ Ortam Değişkenleri (`.env.example`)

Projenin yerelde ve Vercel canlı ortamında sorunsuz çalışması için `.env.example` dosyasında tanımlanan değişkenler şunlardır:

```dotenv
# -----------------------------------------------------------------------------
# 1. Sunucu Tarafı Firebase Admin SDK Ayarları (Firestore & Oturum Doğrulama)
# Firebase Console > Project settings > Service accounts > Generate new private key
# -----------------------------------------------------------------------------
FIREBASE_PROJECT_ID=enteksisakis
FIREBASE_CLIENT_EMAIL=replace-with-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nreplace-with-private-key-content\n-----END PRIVATE KEY-----\n"

# -----------------------------------------------------------------------------
# 2. Yetkili Yönetici Hesabı (Allowlist)
# Firebase Authentication > Users bölümünde oluşturulan e-posta adresi(leri).
# Birden fazla e-posta için virgül ile ayırabilirsiniz.
# -----------------------------------------------------------------------------
ADMIN_EMAIL=admin@enteksis.com,menes.yilm@gmail.com

# -----------------------------------------------------------------------------
# 3. İstemci Tarafı Firebase Web App Ayarları (Giriş Ekranı İçin)
# Firebase Console > Project settings > General > Your apps (Web SDK)
# Bu değerler istemci tanımlayıcılarıdır; gizli servis anahtarı içermez.
# -----------------------------------------------------------------------------
NEXT_PUBLIC_FIREBASE_API_KEY=replace-with-firebase-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=enteksisakis.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=enteksisakis
NEXT_PUBLIC_FIREBASE_APP_ID=replace-with-firebase-web-app-id
```

> **Önemli Güvenlik Notu:** Gerçek özel anahtarları (`FIREBASE_PRIVATE_KEY` vb.) asla `.env.example` veya Git deposuna yazmayın. Yerel geliştirme için `.env.local` dosyasını kullanın; bu dosya `.gitignore` tarafından otomatik olarak korunmaktadır.

---

## 💻 Yerel Kurulum ve Çalıştırma

### 1. Depoyu klonlayın ve bağımlılıkları yükleyin:
```bash
git clone https://github.com/menesyilm/akis.git
cd akis
npm install
```

### 2. Ortam dosyasını oluşturun:
`.env.example` dosyasını kopyalayarak `.env.local` oluşturun ve Firebase bilgilerinizi girin:
```bash
# Windows PowerShell:
Copy-Item .env.example .env.local

# Linux / macOS:
cp .env.example .env.local
```

### 3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```
Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

---

## 🛠️ Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Yerel geliştirme sunucusunu başlatır (`localhost:3000`) |
| `npm run test` | Vitest ile tüm birim ve entegrasyon testlerini çalıştırır |
| `npm run lint` | ESLint ile kod kalitesi ve stil denetimi yapar |
| `npm run typecheck` | TypeScript derleme ve tip kontrollerini çalıştırır (`tsc --noEmit`) |
| `npm run build` | Üretim derlemesini optimize eder ve statik sayfaları üretir |
| `npm run start` | Derlenmiş üretim sürümünü yerelde çalıştırır |

---

## 🔄 Veri Akışı ve Mimari

1. **İstemci Form Doğrulaması:** Ziyaretçi formu doldurduğunda Zod şeması (`requestSchema`) anında çalışır; geçersiz alanlar `aria-invalid` ve ilgili hata mesajlarıyla işaretlenir.
2. **Honeypot Koruması:** Otomatik botları engellemek için gizli `companyWebsite` alanı denetlenir; doluysa işlem reddedilir.
3. **Sunucu API Denetimi (`POST /api/requests`):**
   - İstek boyutu 16 KiB ile sınırlandırılmıştır (`413 Payload Too Large`).
   - JSON formatı doğrulanır (`415 Unsupported Media Type` & `400 Malformed JSON`).
   - Sunucu tarafında Zod doğrulaması tekrarlanır (istemci manipülasyonu engellenir).
4. **Kalıcı Firestore Kaydı:** Veri güvenli Firebase Admin SDK ile `requests` koleksiyonuna sunucu zaman damgasıyla (`FieldValue.serverTimestamp()`) yazılır.
5. **Kesin Başarı Sözleşmesi:** Yalnızca veritabanı yazımı `await` edilip başarılı olduktan sonra `201 Created` ve `{ success: true, requestId: "..." }` yanıtı döner. Sahte başarı mesajı gösterilmez.

---

## 🔐 Yönetici Paneli & Güvenlik

- **Erişim Yolları:** Giriş için `/login`, yönetim paneli için `/admin`.
- **Kimlik Doğrulama:** Firebase Auth Client SDK üzerinden ID token alınır ve sunucuya iletilir.
- **Güvenli Oturum:** Sunucu ID token'ı doğrular ve `ADMIN_EMAIL` allowlist listesinde olup olmadığını kontrol eder. Uygunsa 5 günlük `HttpOnly`, `Secure`, `SameSite=Lax` oturum çerezi (`akis_admin_session`) üretir.
- **Yetkisiz Erişim Koruması:** `/admin` rotasına gelen oturumsuz istekler doğrudan `/login`'e yönlendirilir.
- **Talep Yönetimi:** Yönetici panelinde son 100 talep tarih, isim, e-posta, hizmet türü ve durumuna göre listelenir.

---

## 🧪 Testler ve Doğrulama Kanıtı

Test süiti [tests/](file:///c:/codes/enteksis/akis/tests) dizininde yer almakta olup `npm run test` ile çalıştırılır:
- **Şema Testleri (`tests/request-schema.test.ts`):** 8 test (Geçerli veri, trim, kısa/uzun ad, geçersiz e-posta, geçersiz hizmet, kısa/uzun açıklama).
- **API Rota Testleri (`tests/requests-route.test.ts`):** 6 test (415 Content-Type, 400 bozuk JSON, 400 honeypot, 400 validasyon, 201 başarılı kayıt, 500 DB hatasında iç detay ifşa etmeme).
- **Sonuç:** 14/14 test başarıyla geçmektedir.

---

## 📄 AI Katkı ve Karar Günlüğü

Tüm geliştirme süreci, AI yönlendirmeleri, kabul edilen/reddedilen mimari kararlar ve doğrulama adımları düzenli olarak [`AI_LOG.md`](./AI_LOG.md) dosyasında tutulmaktadır.

- **Proje Planı ve Yönerge:** [`AKIS_PROJE_PLANI.md`](./AKIS_PROJE_PLANI.md)
- **AI Karar Günlüğü:** [`AI_LOG.md`](./AI_LOG.md)
