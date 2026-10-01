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
- **Test:** Vitest (36/36 şema, mock API ve runtime uyumluluk testi)
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
npm ci
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
| `npm run typecheck` | Next.js route tiplerini üretip TypeScript kontrolünü çalıştırır (`next typegen && tsc --noEmit`) |
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
- **Silme:** Yönetici oturumu ve aynı kaynak kontrolü gerektiren `DELETE /api/admin/requests/[requestId]`, onay penceresinden sonra kaydı kalıcı siler.

Firebase Authentication'da Email/Password sağlayıcısını etkinleştirin; yönetici hesabını oluşturup e-postasını `ADMIN_EMAIL` listesine ekleyin. Şifre veya servis hesabı anahtarını README'ye koymayın. `firestore.rules` istemci erişimini kapatır; dosyanın repoda bulunması kuralları otomatik yayımlamaz. Firebase Console'da kuralları ayrıca yayımlayın. Admin SDK erişimi servis hesabının IAM yetkileriyle sağlanır.

---

## 🧪 Testler ve Doğrulama Kanıtı

Test süiti [tests/](./tests) dizininde yer almakta olup `npm run test` ile çalıştırılır:
- **Şema Testleri (`tests/request-schema.test.ts`):** 8 test (Geçerli veri, trim, kısa/uzun ad, geçersiz e-posta, geçersiz hizmet, kısa/uzun açıklama).
- **API Rota Testleri (`tests/requests-route.test.ts`):** 9 test: Content-Type, bozuk JSON, honeypot, validasyon, 201/500; Content-Length ve gerçek stream boyut sınırı; yazma tamamlanmadan başarı dönmemesi.
- **Runtime Uyumluluk Testi (`tests/firebase-runtime.test.ts`):** `require(ESM)` kapalıyken Firebase Admin yükleme, JWKS anahtarıyla imza doğrulama ve değiştirilmiş token reddi.
- **Admin Güvenlik Testleri (`tests/admin-auth.test.ts`):** 17 test; allowlist, origin, token yaşı, güvenli cookie, logout, oturum gövde sınırı ve silme yetkileri.
- **Güvenli Log Testi (`tests/error-log.test.ts`):** Hata mesajı, token ve anahtarın loglanmaması.
- **Sonuç:** 2026-10-01 yeniden kontrolünde 5 dosya, 36/36 test; lint, typecheck ve production build başarılı.
- API testleri repository'yi mock eder; gerçek Firestore yazma ve kalıcılık kanıtı yerine geçmez.

---

## 📄 AI Katkı ve Karar Günlüğü

Tüm geliştirme süreci, AI yönlendirmeleri, kabul edilen/reddedilen mimari kararlar ve doğrulama adımları düzenli olarak [`AI_LOG.md`](./AI_LOG.md) dosyasında tutulmaktadır.

- **Proje Planı ve Yönerge:** [`AKIS_PROJE_PLANI.md`](./AKIS_PROJE_PLANI.md)
- **AI Karar Günlüğü:** [`AI_LOG.md`](./AI_LOG.md)

## Başlangıç kaynağı ve katkı ayrımı

- Git geçmişindeki ilk commit `Initial commit from Create Next App`: başlangıç scaffold'ı [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) ile üretildi.
- Next.js, React, Firebase, Zod, Framer Motion ve Vercel Analytics açık kaynak/sağlayıcı bağımlılıklarıdır. Landing page içeriği ve tasarımı, form/API, Firestore repository, yönetici akışı, testler ve belgeler proje kapsamında AI desteğiyle geliştirildi.
- Codex ve Antigravity ile yapılan işler ve adayın bildirdiği kararlar AI_LOG'da kayıtlıdır. Aday teslimden önce araç/model isimleri, kendi katkıları ve karar ifadelerini doğrulamalıdır; günlükteki geçmiş kayıtlar bu denetimde bağımsız doğrulanmış sayılmadı.

## Vercel runtime uyumluluğu

`firebase-admin → jwks-rsa → jose` zincirinde `ERR_REQUIRE_ESM` hatası Vercel runtime loglarıyla belirlendi. Node.js `24.x` seçimi tek başına yeterli olmadı; `package.json` içindeki scoped override yalnızca `jwks-rsa` altında `jose@5.10.0` kullanır. Node.js 24'te `--no-experimental-require-module` ile sorun yeniden üretilip düzeltme test edildi. Kullanıcı düzeltmeden sonra canlı sorunun çözüldüğünü bildirdi; bu denetimde canlı login ekranı da açıldı.

## Bilinen sınırlar ve teslim kanıtı

- Dağıtık rate limiting, CAPTCHA ve idempotency yoktur. Honeypot ve butonun gönderim sırasında kapatılması tam spam/tekrar kayıt koruması değildir. Ağ yanıtı kaybolursa tekrar gönderim ikinci kayıt oluşturabilir.
- Yönetici paneli son 100 kaydı listeler; sayfalama ve arama yoktur. Silme kalıcıdır.
- Vurgu metni `#596544` ile yaklaşık 5.69:1 kontrasta sahiptir. Framer Motion reduced-motion tercihini kullanır; SSR içeriği başlangıçta gizlenmez. Mobil menü native modal dialog ile arka planı erişilebilirlik ağacından ayırır.
- Firebase hataları kullanıcıya genel mesaj olarak döner. Sunucu loglarına yalnızca işlem adı ve sınırlı SDK hata kodu yazılır; mesaj, token, anahtar ve kişisel veri yazılmaz. Altyapı kaynaklı session hataları 503, geçersiz token 401 döner.
- Canlı API ve tarayıcı formu kurgusal verilerle başarı verdi; dönen IDler Firestoreda geri okundu, yenileme sonrası kalıcılık doğrulandı. Kanıt: [LIVE_VERIFICATION.json](./LIVE_VERIFICATION.json) ve [başarı ekranı](./docs/live-success.jpg). Yetkili admin girişi/silmesi mock testleriyle kontrol edildi; gerçek yönetici hesabıyla bu oturumda oturum açılmadı.
- Yalnızca kurgusal test verisi kullanın: örneğin `Deneme Kullanıcısı`, `deneme@example.com`. Teslimde formun döndürdüğü kayıt ID'sini Firestore belgesiyle eşleştirin, yenilemeden sonra kaldığını doğrulayın; gerçek kişisel verileri kanıta eklemeyin.
- Önceki AI_LOG sürelerinin çakışmalar çıkarılmış toplamı yaklaşık 4 saattir; bu, süresi yazılmayan aşamaları kapsayan eksiksiz aktif emek ölçümü değildir. Son teslim iyileştirme oturumu ayrıca günlüğe kaydedilir.
- Teslim commit kimliği son dokümantasyon değişiklikleri commit edilip pushlandıktan sonra `git rev-parse HEAD` ile alınarak teslim alanında belirtilir. Vercel production deployment'ın aynı commit'ten çıktığı kontrol edilir; bu belgenin içine kendi commit SHA'sı yazılmaz.

Ayrıntılı gereksinim eşleştirmesi ve öncelikler: [TESLIM_DENETIMI.md](./TESLIM_DENETIMI.md).

## Teslim doğrulamasını tekrar çalıştırma

Node.js 24 ile `npm ci`, `.env.example` → `.env.local`, Firebase ayarları ve `npm run dev`. Kontroller: `npm run test`, `npm run lint`, `npm run typecheck`, `npm run build`. GitHub Actions aynı kontrolleri push ve PR üzerinde çalıştırır.

Canlı test: `node scripts/verify-live.mjs https://enteksis-akis.vercel.app BEKLENEN_COMMIT_SHA`. Bu komut yalnızca kurgusal bir talep kaydı oluşturur, dönen ID ile Firestore geri okumasını ve yenileme sonrası kalıcılığı doğrular; mevcut kayıtları silmez. Firebase Admin kimlik bilgileri yalnızca yerel `.env.local` içinden okunur. `LIVE_VERIFICATION.json` kanıt dosyasında sır veya gerçek kişi bilgisi bulunmaz.

`/api/health` yalnızca yayın durumunu ve `VERCEL_GIT_COMMIT_SHA` değerini döndürür; teslim SHA eşleşmesini buradan kontrol edebilirsiniz.

Temiz Linux kurulumunda GitHub Actions doğrulaması başarılı: [CI koşusu](https://github.com/menesyilm/akis/actions/runs/36866874449). İlk CI denemesinde yakalanan `LayoutProps` üretim eksikliği `next typegen` ile giderildi. Son belge commit'inden sonra teslim SHA'sı production health ile yeniden eşleştirilir.
