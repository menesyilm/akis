# Akış — iş otomasyonu talep sayfası

Akış, küçük işletmelerin sipariş takibi, raporlama ve görev/hatırlatma süreçleri için otomasyon talebi bırakabildiği Türkçe bir değerlendirme projesidir. Otomasyon motoru ve e-posta gönderimi içermez; yönetim ekranı yalnızca allowlist'teki yönetici hesabına açıktır.

## Teknoloji ve akış

- Next.js App Router, React ve TypeScript: sayfa ve sunucu API'si.
- Zod: tarayıcı ve sunucuda kullanılan ortak form doğrulaması.
- Firebase Authentication: yönetici için e-posta/şifre girişi.
- Firebase Admin SDK ve Firestore: sunucudan kalıcı talep kaydı.
- Framer Motion: sayfa içi görünme ve hover animasyonları.
- Vitest: şema ve API davranış testleri.
- Vercel: dağıtım hedefi.

Form `POST /api/requests` isteği gönderir. Sunucu içerik türünü ve gövde boyutunu denetler, honeypot alanını ve Zod şemasını doğrular, ardından Firestore'da `requests/{id}` belgesi oluşturur. Yalnızca Firestore yazımı tamamlanınca `201` ve `{ "success": true, "requestId": "..." }` döner. Belge `name`, `email`, `service`, `description`, `createdAt` ve `status: "new"` alanlarını içerir. İstemciden tarih, durum veya belge kimliği kabul edilmez. Başarı, HTTP hata kodu, istemci doğrulaması ve bağlantı hataları sonuç penceresinde gösterilir; form yalnızca doğrulanmış başarıdan sonra temizlenir.

## Yerel kurulum

Node.js ve npm kurulu olmalıdır. Depo kökünde:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Windows PowerShell'de `.env.example` dosyasını `.env.local` olarak kopyalayabilir, ardından dosyayı yerel Firebase servis hesabı değerleriyle düzenleyebilirsin. `.env.local` Git'e eklenmemelidir.

Firebase Console'da Firestore'u oluştur ve **Project settings → Service accounts → Firebase Admin SDK** bölümünden sunucu servis hesabı değerlerini al. İndirilen JSON anahtar dosyasını repoya veya sohbete koyma. `.env.local` içine yalnızca şu değişkenleri ekle:

```dotenv
FIREBASE_PROJECT_ID=proje-id
FIREBASE_CLIENT_EMAIL=servis-hesabi-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYERELDEKI_GERCEK_ANAHTAR\n-----END PRIVATE KEY-----\n"
```

Gerçek değerleri `.env.example` içine yazma. Firebase Admin değişkenleri `NEXT_PUBLIC_` ile başlamamalı; bunlar sadece sunucu tarafında kullanılır. Değerleri değiştirdikten sonra geliştirme sunucusunu yeniden başlat.

Firestore Rules için `firestore.rules` dosyasındaki istemci okuma/yazma engelini kullanıp Firebase Console'da yayımla. Admin SDK sunucuda bu kuralları aşar; bu nedenle API doğrulaması ve servis hesabı erişimi önemlidir.

## Komutlar

```bash
npm run dev       # Yerel geliştirme sunucusu
npm run test      # Vitest testleri
npm run lint      # ESLint
npm run typecheck # TypeScript kontrolü
npm run build     # Üretim derlemesi
npm run start     # Önceden derlenmiş uygulamayı çalıştır
```

Otomatik testler Zod alan doğrulamalarını ve API'nin 400/201/500 gibi davranışlarını sınar. Mock'lu testler tek başına canlı Firestore veya Vercel doğrulaması sayılmaz.

## Dağıtım ve canlı kontrol

1. GitHub deposunu Vercel'e bağla. Root Directory `.` ve framework Next.js olmalı.
2. Vercel **Settings → Environment Variables** bölümüne `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` ve `FIREBASE_PRIVATE_KEY` değerlerini güvenli biçimde ekle. Değerleri Git'e veya bu dosyaya koyma.
3. Production ve kullanacağın Preview ortamlarını seç; değişiklikten sonra yeniden deploy et.
4. Canlı URL'de formu kurgusal bilgilerle gönder. Tarayıcı Network panelinde `POST /api/requests` yanıtının `201` ve kayıt numarası içerdiğini kontrol et.
5. Firebase Console → Firestore Database → `requests` bölümünde aynı kayıt kimliğini, alanları ve `new` durumunu kontrol et.
6. Geçersiz alanlar, bozuk JSON, JSON olmayan content type ve 16 KiB üzerindeki gövde için sırasıyla `400`, `400`, `415` ve `413` yanıtlarını kontrol et. Hatalı istek yeni belge oluşturmamalı.
7. 375 px, 768 px ve masaüstü genişliğinde görünümü; ayrıca klavye ile form dolaşımını kontrol et.

**Canlı deployment:** [https://enteksis-akis.vercel.app](https://enteksis-akis.vercel.app). Kullanıcının paylaştığı ekran görüntüsünde form gönderiminin başarı mesajı ve kayıt numarası görünüyor. Son deployment'ın hangi Git SHA'sından üretildiği bu oturumda ayrıca doğrulanmadı.

## Yönetici girişi ve talepler

- Giriş: `/login`; yönetim ekranı: `/admin`. Bunlar gerçek Next.js yollarıdır; `/#/login` biçiminde hash kullanılmaz.
- Firebase Console → Authentication → Sign-in method bölümünden **Email/Password** yöntemini etkinleştir. Authentication → Users bölümünde yönetici hesabını oluştur.
- Authentication → Settings → Authorized domains bölümünde `enteksis-akis.vercel.app` alan adının bulunduğunu doğrula; yoksa ekle.
- Vercel Environment Variables ve yerel `.env.local` içinde `ADMIN_EMAIL` değerini bu hesabın e-posta adresi yap. Firebase Console → Project settings → Your apps içinden alınan web ayarlarını `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID` ve `NEXT_PUBLIC_FIREBASE_APP_ID` değişkenlerine koy. Vercel'de bunları gerekli ortamlara ekleyip yeniden deploy et.
- Sunucuda talep kaydı için kullanılan Firebase Admin değerleri (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) da tanımlı olmalı. Gerçek özel anahtarı Git'e veya `.env.example` dosyasına koyma.
- Giriş, yalnızca `ADMIN_EMAIL` ile eşleşen Firebase hesabına verilir. Sunucu 5 günlük `HttpOnly` oturum çerezi kurar; production'da `Secure`, `SameSite=Lax` kullanılır. Yönetici ekranı her istekte bu oturumu sunucuda doğrular. Oturumsuz kullanıcı `/login`'e, aktif oturumdaki kullanıcı `/login`'den `/admin`'e yönlendirilir. Çıkış oturum çerezini temizler.
- Admin ekranı en yeni 100 `requests` kaydını kayıt numarası, tarih, ad, e-posta, hizmet, açıklama ve durumuyla gösterir. Veriler istemci Firebase SDK'sıyla değil, doğrulanmış sunucu oturumu ve Admin SDK ile okunur.
- Her talep kartındaki çöp kutusu, önce X/İptal/Eminim seçenekli onay penceresi açar. Yalnızca açık onaydan sonra aynı kaynaklı `DELETE /api/admin/requests/{requestId}` isteği Firestore belgesini kalıcı siler; geri alma yoktur. Endpoint aktif admin oturumunu doğrular.

## Güvenlik ve bilinen sınırlar

- Firestore talep verileri kişisel bilgi içerebilir. Yalnızca gerekli test verilerini kullan; gerçek kullanıcı verisiyle deneme yapma.
- Honeypot ek bir spam sinyalidir, güvenlik garantisi değildir. Dağıtık rate limit ve ağ belirsizliğinde tekrar gönderimi önleyen idempotency bu kapsamda yoktur.
- İstemci ağ zaman aşımında Firestore kaydı oluşmuş olabileceğinden form kayıt başarısını doğrulanmış gibi göstermez. Tekrar göndermeden önce Firestore'u kontrol et.
- Uygulama e-posta göndermez; sayfa yalnızca kayıt sonucunu bildirir.

## Kaynak ve AI katkı kaydı

- GitHub: [menesyilm/akis](https://github.com/menesyilm/akis)
- AI önerileri ve kullanıcı kararları: [`AI_LOG.md`](./AI_LOG.md)
- Uygulama ve değerlendirme kapsamı: [`AKIS_PROJE_PLANI.md`](./AKIS_PROJE_PLANI.md)
- Portal tesliminde canlı URL, son commit SHA'sı ve gerçek çalışma süresini ayrıca belirt.
