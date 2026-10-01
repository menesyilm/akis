# Akış — iş otomasyonu talep sayfası

Akış, küçük işletmelerin sipariş takibi, raporlama ve görev/hatırlatma süreçleri için otomasyon talebi bırakabildiği Türkçe bir değerlendirme projesidir. Bu proje otomasyon motoru, kullanıcı girişi veya e-posta gönderimi içermez.

## Teknoloji ve akış

- Next.js App Router, React ve TypeScript: sayfa ve sunucu API'si.
- Zod: tarayıcı ve sunucuda kullanılan ortak form doğrulaması.
- Firebase Admin SDK ve Firestore: sunucudan kalıcı talep kaydı.
- Framer Motion: sayfa içi görünme ve hover animasyonları.
- Vitest: şema ve API davranış testleri.
- Vercel: dağıtım hedefi.

Form `POST /api/requests` isteği gönderir. Sunucu içerik türünü ve gövde boyutunu denetler, honeypot alanını ve Zod şemasını doğrular, ardından Firestore'da `requests/{id}` belgesi oluşturur. Yalnızca Firestore yazımı tamamlanınca `201` ve `{ "success": true, "requestId": "..." }` döner. Belge `name`, `email`, `service`, `description`, `createdAt` ve `status: "new"` alanlarını içerir. İstemciden tarih, durum veya belge kimliği kabul edilmez.

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

**Canlı deployment URL'si:** Henüz README'ye eklenmedi; canlı adres ve son commit'ten üretildiği doğrulandıktan sonra eklenmeli.

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
