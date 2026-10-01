# ENTEKSİS — Akış proje planı ve Codex uygulama talimatı

Bu belge, değerlendirme görevini 3–4 saat hedef emekle tamamlamak için kapsamı, kurulum sırasını, commit noktalarını ve doğrulama ölçütlerini tanımlar. Süre hedefi garanti değildir; gerçek emek dürüstçe kaydedilir. Portalın 24 saatlik penceresini yalnızca hazır olduğunda başlat.

## 1. Ürün ve kapsam

Akış, küçük işletmeler için kurgusal iş otomasyonu hizmetidir. Sipariş takibi, raporlama ve görev/hatırlatma süreçlerinin otomasyonu için ziyaretçiden talep toplar. Otomasyon motoru geliştirilmez; hizmet landing page’i ve çalışan talep toplama akışı geliştirilir.

Ana mesaj: “Tekrarlayan işleri otomatikleştirin, işinize zaman ayırın.”

Hizmetler:
- Sipariş takibi: Farklı kanallardan gelen siparişleri ortak bir iş akışında toplama.
- Raporlama: Tekrarlanan raporların otomatik hazırlanması.
- Görev ve hatırlatma: İşlerin ilgili kişilere zamanında iletilmesi.

Sayfa sırası: marka ve navigasyon; ana mesaj ve “Talep oluştur” bağlantısı; üç hizmet kartı; “İhtiyacını anlat / Birlikte değerlendirelim / Çözümü planlayalım” bölümü; talep formu; kurgusal değerlendirme projesi açıklaması.

Türkçe içerik, mobil ve masaüstü uyumu, belirgin odak göstergeleri, okunaklı kontrast, gerçek label’lar ve klavye kullanımı zorunludur. Sahte müşteri yorumları, başarı istatistikleri veya gerçekten gönderilmeyen e-posta için “e-posta gönderildi” mesajı ekleme.

Kapsam dışında: kullanıcı girişi, admin paneli, ödeme, gerçek otomasyon, push bildirim, e-posta, dosya yükleme ve çok sayfalı sistem. Sayfa içindeki gönderiliyor/başarı/hata mesajları görev için yeterlidir.

## 2. Teknoloji kararı

| Teknoloji | Görevi |
|---|---|
| Next.js App Router + TypeScript | Sayfa ve sunucu API’si |
| Tailwind CSS | Uyumlu tasarım |
| Zod | Ortak istemci/sunucu doğrulaması |
| Firebase Firestore Standard | Kalıcı talep kaydı |
| Firebase Admin SDK | Yalnızca sunucudan veritabanı erişimi |
| Vercel | Next.js sayfasını ve API’sini yayınlama |
| GitHub | Kaynak kod ve commit geçmişi |
| Vitest | Şema ve API davranış testleri |

Bu yapı için ayrı Express sunucusu, Firebase Cloud Functions veya ASP.NET projesi gerekmez. Firebase veriyi saklar; Vercel sunucu kodunu çalıştırır. Firestore’un ücretsiz kotası ve Vercel Hobby sınırları bu küçük ticari olmayan demo için değerlendirilebilir; güncel şartları hesaplarda kontrol et. Firebase’de ücretli özellikleri etkinleştirme ihtiyacı yoktur.

## 3. Yerel klasör ve proje oluşturma

Windows PowerShell örneğinde üst dizin C:\codes seçilmiştir. Gerçek üst dizinin farklıysa yalnızca bu kısmı değiştir. Git deposunun kökü enteksis/akis olmalıdır; enteksis yalnızca üst klasördür.

```powershell
node --version
npm --version
git --version
```

Güncel Node.js LTS, Git ve kod editörü kurulu olmalı. Güncel Next.js belgesinde minimum Node.js 20.9 belirtilir; eski bir Node sürümüyle başlama.

### akis henüz oluşturulmadıysa

```powershell
New-Item -ItemType Directory -Force C:\codes\enteksis
Set-Location C:\codes\enteksis
npx create-next-app@latest akis --typescript --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*"
Set-Location .\akis
```

Ek soru çıkarsa React Compiler için varsayılan seçeneği kullan; TypeScript, ESLint, Tailwind, src dizini ve App Router açık olmalı. İçe aktarma kısaltması @/* olsun.

### akis zaten var ve boşsa

```powershell
Set-Location C:\codes\enteksis\akis
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*"
```

İki yöntemi birlikte çalıştırma. Dolu klasörde mevcut dosyaları silme. MD dosyasını scaffold işlemi bittikten sonra akis içine kopyala; önceden kopyalamak oluşturma komutunda klasör çakışmasına yol açabilir.

```powershell
npm install firebase-admin zod server-only
npm install -D vitest
npm run dev
```

Tarayıcıda http://localhost:3000 aç. Sunucuyu durdurmak için Ctrl+C kullan. Terminal komutlarının geri kalanı akis dizininde çalıştırılır.

## 4. Git başlangıcı ve GitHub

create-next-app Git deposu ve başlangıç commit’i oluşturmuş olabilir. Önce kontrol et:

```powershell
git status
git rev-parse --show-toplevel
git log --oneline -3
```

Depo yoksa git init çalıştır. Üst klasör zaten başka bir depo ise iç içe depo oluşturmadan önce kökü düzelt. Git kullanıcı kimliği eksikse kendi adın ve GitHub e-posta adresinle git config user.name ve git config user.email ayarla.

Bu MD dosyasını akis köküne AKIS_PROJE_PLANI.md adıyla kopyala. .gitignore içinde .env* ignore edilmeli, yalnızca örnek dosya !.env.example ile istisna olmalı. node_modules, .next, coverage, gerçek servis hesabı JSON dosyaları ve anahtarlar commit edilmemeli. JSON dosyalarının tamamını ignore etme: package.json gereklidir.

İlk commit: scaffold, bağımlılıklar, plan ve güvenli örnek ortam dosyası hazır olduğunda:

```powershell
git status
git diff --cached
git add .
git diff --cached --stat
git commit -m "chore: initialize Akis project and implementation plan"
git branch -M main
```

git add öncesinde .gitignore’u kontrol et; staged değişikliklerde sır olmadığından emin ol. Scaffold’ın önceki otomatik commit’ini değiştirme.

GitHub’da New repository ile akis adlı boş repo oluştur. README, .gitignore veya lisans kutularını işaretleme; yerelde zaten dosyalar var. Public olabilir; Private ise değerlendirici erişimini ayrıca sağla. Aşağıdaki URL’de KULLANICI_ADIN yerine gerçek hesabını yaz:

```powershell
git remote add origin https://github.com/KULLANICI_ADIN/akis.git
git push -u origin main
```

origin zaten varsa git remote -v ile kontrol et; körlemesine değiştirme. GitHub girişini güvenli tarayıcı/credential manager akışında tamamla; token’ı dosyaya veya komuta yazma.

## 5. Firebase kurulumu — kullanıcı yapacak

1. Firebase Console’da yeni bir proje oluştur: örneğin akis-enteksis-demo. Analytics bu görev için gerekli değildir.
2. Firestore Database oluştur; Standard edition ve ücretsiz Spark planıyla başla. Konum seçimini kaydet; Avrupa konumu uygundur.
3. Production/locked mode kullan. Firebase Authentication, Storage, Messaging veya Cloud Functions kurma.
4. Rules bölümünde istemci erişimini kapat ve Publish et:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Project settings → Service accounts → Firebase Admin SDK bölümünden servis hesabı anahtarı oluştur. İndirilen JSON’u proje ve Git dışında güvenli tut; sohbete yükleme.
6. JSON’daki project_id, client_email ve private_key değerlerini yerelde .env.local içine koy. Anahtarın newline biçimini koru. Kod escaped \\n değerlerini gerçek newline’a dönüştürebilmeli.

```dotenv
FIREBASE_PROJECT_ID=proje-id
FIREBASE_CLIENT_EMAIL=servis-hesabi-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nGERCEK_ANAHTAR_YERELDE\n-----END PRIVATE KEY-----\n"
```

.env.example aynı değişkenleri boş veya sahte placeholder ile içerir. Bunlara NEXT_PUBLIC_ öneki ekleme. Sunucu Admin SDK, Firestore Rules’u bypass eder; sunucu doğrulaması ve servis hesabının IAM yetkileri asıl sınırdır. Rules’u kapatmak API’nin kötüye kullanımını tek başına önlemez.

7. .env.local değiştiğinde npm run dev sürecini yeniden başlat. Firestore’da requests koleksiyonu ilk gerçek başarılı API kaydında oluşabilir; elle test belgesi oluşturarak API çalışıyormuş gibi gösterme.

## 6. Kod düzeni

Aşağıdaki yollar hedef yapıdır; scaffold sürümünün ürettiği konfigürasyon dosyaları korunur:

```text
enteksis/akis/
  AKIS_PROJE_PLANI.md
  README.md
  AI_LOG.md
  .env.example
  .env.local              # yerel, Git dışında
  .gitignore
  firestore.rules
  package.json
  package-lock.json
  src/app/layout.tsx
  src/app/page.tsx
  src/app/globals.css
  src/app/api/requests/route.ts
  src/components/request-form.tsx
  src/lib/request-schema.ts
  src/lib/services.ts
  src/lib/server/firebase-admin.ts
  src/lib/server/request-repository.ts
  tests/request-schema.test.ts
  tests/requests-route.test.ts
```

page.tsx mümkün olduğunca server component; etkileşimli form client component olsun. Firebase Admin modülünde server-only koruması kullan. route.ts Node.js runtime kullanmalı. Firebase başlatmasını tekrar başlatmaya dayanıklı ve gerektiğinde çalışan şekilde kur; build sırasında anahtar yok diye bütün statik sayfa çökmemeli. Ancak API çalışma anında eksik ayarı açıkça hata olarak ele almalı; sahte başarı vermemeli.

## 7. Form ve API sözleşmesi

| Alan | Kural |
|---|---|
| name | Trim sonrası 2–80 karakter |
| email | Trim sonrası geçerli e-posta, en fazla 254 karakter |
| service | order-tracking, reporting veya task-reminders |
| description | Trim sonrası 10–1000 karakter |

Hizmetlerin kullanıcıya görünen Türkçe adları services.ts içinde tek yerde tutulur. Ortak Zod şeması sunucuda mutlaka çalışır; tarayıcı doğrulamasına güvenilmez. Bilinmeyen hizmetler reddedilir. Oluşturma tarihi, durum ve belge ID’si istemciden alınmaz.

POST /api/requests JSON kabul eder. Başarılı yazma await edildikten sonra HTTP 201 ve { success: true, requestId: "..." } döner. Geçersiz alan veya bozuk JSON için HTTP 400; uygun olmayan content type için 415; aşırı büyük gövde için 413; kayıt/konfigürasyon hatası için 500 ve kullanıcıya genel Türkçe hata mesajı döner. İç hata, anahtar, stack trace veya kişisel veri istemciye/loglara dökülmez. Gövdeye küçük bir limit koy (örneğin 16 KiB); gerçek gelen boyutu da sınırla, sadece Content-Length’e güvenme.

requests/{id} belgesi: name, email, service, description, createdAt (server timestamp), status: new.

Form durumları: boşta / gönderiliyor / başarı / hata. Gönderim boyunca buton disable; başarı yalnızca başarılı HTTP yanıtı ve geçerli requestId varsa görünür. Hata durumunda alanlar korunur. Başarı metni “Talebiniz kaydedildi. Kayıt numarası: …” olur; e-posta gönderildiği iddia edilmez. Alan hatalarında aria-invalid ve aria-describedby, durum mesajında uygun live region kullanılır; başarısız doğrulamada ilk hatalı alana odaklanılır.

Honeypot basit ek spam önlemi olarak eklenebilir; dolu olduğunda kayıt yapmadan açık hata dön. Kullanıcılara gerçek güvenlik garantisi sunma. Sunucusuz ortamda bellekte rate limiter kalıcı/dağıtık koruma değildir; kullanılırsa sınırı README’de doğru açıkla. İlk teslimde dağıtık rate limiting ve uçtan uca idempotency olmaması bilinen eksik olarak dürüstçe yazılabilir. Buton disable yalnızca aynı arayüzde eşzamanlı tıklamayı azaltır; ağ belirsizliğinde tekrar kayıt mümkündür.

## 8. Aşamalar ve commit noktaları

Her aşamada AI_LOG.md’ye gerçek yapılan işi, kabul/değiştirme kararını ve doğrulama sonucunu ekle. Çalışmayan özelliği tamamlandı diye commit mesajında veya belgede anlatma. Her commit öncesi git status ve staged diff’i kontrol et. Aşamaları tek seferde üretip sonradan yapay geçmiş oluşturma.

| Aşama | Yaklaşık hedef | Kontrol | Commit mesajı |
|---|---|---|---|
| 1. Kurulum | 0–30 dk | Scaffold çalışıyor, sırlar ignore edilmiş, repo bağlı | chore: initialize Akis project and implementation plan |
| 2. Landing page | 30–90 dk | Mobil, masaüstü ve klavye kontrolü | feat: build responsive automation service landing page |
| 3. Form ve kayıt | 90–150 dk | Gerçek API kaydı, invalid payload ve hata davranışı | feat: validate and persist service requests in Firestore |
| 4. Test ve düzeltme | 150–195 dk | Test, lint, typecheck, build; bulunan sorunlar giderilmiş | test: verify request validation and persistence failures |
| 5. Teslim | 195–240 dk | Canlı test ve dokümantasyon tamam | docs: finalize setup verification and AI decision log |

Her aşama sonunda:

```powershell
git status
git add .
git diff --cached
git commit -m "TABLODAKI_UYGUN_MESAJ"
git push
```

İş aynı kapsamda düzeltme gerektirirse gerçek ek fix commit’i at. Sırları görüntüleyen diff çıktısını paylaşma. Başarısız kontrol varsa düzeltmeden aşamayı tamamlanmış sayma.

## 9. Testler ve kanıt

Codex package.json’a test, lint ve typecheck komutlarını kurulu sürüme uygun ekler: vitest run; eslint .; tsc --noEmit. next lint varsayma.

```powershell
npm run test
npm run lint
npm run typecheck
npm run build
```

Anlamlı otomatik testler:
- Şema geçerli veri, trim, boş isim, hatalı e-posta, hizmet enum’u ve uzunluk sınırlarını sınar.
- API bozuk JSON ve geçersiz payload için repository’yi çağırmaz.
- Repository promise’i sonuçlanmadan API başarı dönmez; reject ederse 500 döner, success/requestId içermez.
- Başarılı kayıt doğru ID ve 201 döner. Admin erişimi testlerde mock edilir; bunlar gerçek Firestore kanıtı yerine geçmez.

Manuel canlı kontroller:
1. Kurgusal isim “Deneme Kullanıcısı”, e-posta deneme@example.com, seçilen hizmet ve kurgusal açıklamayla form gönder.
2. DevTools Network’te POST yanıtının 201 ve requestId içerdiğini kontrol et.
3. Firestore Console’da aynı belge ID’sini ve alanları kontrol et. Sayfayı yeniledikten sonra kaydın durduğunu doğrula.
4. İstemciyi atlayarak API’ye geçersiz veri gönder; 400 ve yeni kayıt oluşmadığını doğrula.
5. Yerel mock testinde veya yerel kontrollü hata koşulunda kayıt reddini doğrula; başarı mesajı çıkmamalı, alanlar korunmalı. Canlı projenin anahtarlarını bozma.
6. Ağ hatasında formun hatayı gösterdiğini kontrol et. Ağ yanıtı kaybolsa bile kayıt yapılmış olabileceğini başarıyla karıştırma.
7. 375 px, 768 px ve geniş masaüstünde yatay taşma, form ve navigasyon kontrolü yap.
8. Sadece klavye ile forma ulaş, doldur, gönder; focus ve hata ilişkilendirmesini kontrol et.

Yapmadığın kontrolü yapılmış yazma. Firestore erişimi kullanıcıda ise kanıtı kullanıcı tamamlayana kadar doğrulama bekliyor yaz.

## 10. Vercel yayınlama — erken başlat

1. İlk push sonrası Vercel’de GitHub ile giriş yapıp Add New → Project → akis reposunu import et.
2. Framework Next.js, Root Directory repo kökü (.) olsun. Yerel üst klasör enteksis olduğundan Vercel’e akis/akis yazma. Repo kökünde package.json bulunmalı.
3. İlk scaffold yayını deployment altyapısını erken doğrular. Form tamamlanmadan kayıt çalışıyor diye teslim etme.
4. Settings → Environment Variables bölümüne FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY ekle. Gerçek değerleri yalnızca güvenli ayar ekranına gir; server-only olarak kullan.
5. Production ve gerekli Preview/Development ortamlarını seç. Private key’de newline formatı .env.local ile farklı olabilir; kod hem gerçek newline hem escaped newline’ı desteklemeli.
6. Değişkenler eklenince yeniden deploy et. Firebase Admin için statik export kullanma; Next.js API çalışmalı.
7. Canlı URL’de formu gönderip Firestore’da kayıt eşleştirmesini tekrar yap. İncelemeyi engelleyen deployment protection varsa değerlendirici erişimini sağla.
8. Canlı URL’yi README’ye ekle. Son commit’i push ettikten sonra Vercel production deployment’ın bu commit’ten çıktığını doğrula.

## 11. README ve AI_LOG

README: ürün ve kapsam; teknoloji; kurulum; ortam değişkeni adları; Firebase Rules; geliştirme ve test komutları; API/veri akışı; gerçek doğrulama adımları ve sonuçlar; canlı URL; kaynak erişimi; bilinen eksikler; kullanılan scaffold/template kaynağı; kendi katkın ve varsa başka katkılar; gerçek süre.

AI_LOG: tarih/aşama; kullanılan gerçek araç; verilen önemli yönlendirme; AI önerisi; kabul/değiştirme/reddetme kararı ve gerekçe; yapılan doğrulama ve gerçek sonucu. Uydurma hata, uydurma araç veya kişinin vermediği kararları onun kararı diye yazma. Adayın AI taslaklarını inceleyip kendi kararlarını ve gerçek emeğini doğrulaması gerekir. Çalışma sırasında tut; sonradan kusursuz bir hikâye üretme.

Teslim commit’inin SHA’sını kendi içine koymak döngü oluşturur. README’ye “teslim commit’i portalda belirtilir” yaz; son commit sonrası aşağıdaki çıktıyı portalın teslim alanına kopyala:

```powershell
git status
git rev-parse HEAD
git log -5 --oneline
```

Teslim: canlı URL, erişilebilir repo URL’si, tam commit SHA, README ve AI_LOG (repoda), gerçek çalışma süresi. SHA alındıktan sonra kod değişirse yeni SHA’yı teslim et ve o commit’in canlıya çıktığını kontrol et.

## 12. Codex’e verilecek talimat

Bu bölüm bir uygulama talimatıdır. Çalışma alanı enteksis/akis projesidir.

AKIS_PROJE_PLANI.md dosyasını tamamen oku ve projeyi buradaki kapsamla uygula. Önce cwd, package.json, mevcut dosyalar, git status, git root ve remote’ları kontrol et. Scaffold varsa yeniden oluşturma; akis/akis şeklinde iç klasör açma. Kullanıcının mevcut değişikliklerini silme veya üzerine körlemesine yazma.

Next.js App Router, TypeScript, Tailwind, Zod, Firebase Admin SDK ve Firestore kullan. Arayüz Türkçe olsun. Sunucu üzerinden kalıcı kayıt ve gerçek hata akışı temel önceliktir. Sırları okutup yazdırma, istemciye taşıma veya commit etme. .env.example güvenli olsun. Gerçek Firebase kimlik bilgileri olmadan da tasarım, şema, API testleri ve build üzerinde ilerle; gerçek bağlantı doğrulamasını tamamlandı sayma. Kullanıcıya eksik Firebase/Vercel adımlarını açıkça bildir.

Bu plandaki aşamaları sırayla uygula. Her tamamlanan aşamada gerekli kontrolleri çalıştır, AI_LOG’u güncelle, diff’i incele ve tabloda belirtilen anlamlı commit’i oluştur. Kurulu scaffold sürümüne uygun script kullan. Yerel commit yetkisi bu talimatla verilir. Kullanıcının ayarlanmış doğru origin’i varsa her aşamayı push et; URL/hesap yoksa uydurma, yerel işi sürdür ve eksik bilgiyi bildir. Yayın için mevcut Vercel yetkilendirmesi varsa kullan; yoksa kullanıcı adımlarını açık ver. Firebase hesabı/anahtar oluşturma gibi kullanıcı hesabı adımlarını uydurarak tamamlandı gösterme.

Sadece UI veya in-memory kayıtla durma. Firestore yazması başarılı olmadan success dönme. Başarısız testleri düzelt. Gereksiz özellik ve bağımlılık ekleme. Son raporda değişen davranışı, gerçek test sonuçlarını, kalan kullanıcı adımlarını, son commit SHA’sını ve bildiğin canlı URL’yi belirt. Görüşmede adayın anlatabilmesi için her aşamada kısa bir veri akışı/karar açıklaması ver.

## 13. Resmî kaynaklar

- Next.js kurulum: https://nextjs.org/docs/app/getting-started/installation
- create-next-app seçenekleri: https://nextjs.org/docs/app/api-reference/cli/create-next-app
- Firebase Admin kurulumu: https://firebase.google.com/docs/admin/setup
- Firestore ücretsiz kota/fiyatlandırma: https://firebase.google.com/docs/firestore/pricing
- Vercel Hobby koşulları: https://vercel.com/docs/plans/hobby

Değerlendirme rehberi: https://alex-aday-merkezi.enteksi-s-te-3777.chatgpt.site/degerlendirme-rehberi.md — bu plan hazırlanırken rehbere erişilemedi; kullanıcının paylaştığı görev metni esas alındı.
