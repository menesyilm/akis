# AI decision log

## 2026-10-01 — Firebase sunucu yapılandırması

**Araç:** Claude (Codex)
**Süre:** ~20 dakika

### İstek
Landing page'den önce Firebase yapılandırmasını hazırla; servis hesabı anahtarlarını repo'ya koyma.

### AI önerisi → Kararım
- AI hem Web SDK hem Admin SDK kullanımı önerdi → **Admin SDK'yı seçtim** çünkü yazma işlemi yalnızca sunucudan olacak; Web SDK konfigürasyonu kullanıcı tarafından zaten eklenmişti, korundu ama aktif kullanılmadı.
- AI Analytics entegrasyonu önerdi → **Reddettim**, kapsam dışı.
- AI escaped `\\n` desteği önerdi → **Kabul** ettim çünkü Vercel ve yerel ortam private key newline formatı farklı olabiliyor.

### Yapılan iş
- `src/lib/server/firebase-admin.ts`: Admin SDK başlatıcısı (escaped `\\n` → gerçek newline dönüşümü dahil, tekrar başlatmaya dayanıklı)
- `firestore.rules`: İstemci erişimi tamamen kapalı (`allow read, write: if false`)
- `.env.example`: Placeholder değerlerle örnek dosya oluşturuldu
- `.gitignore`: `.env*` ignore, `!.env.example` istisna eklendi

### Doğrulama
- Dosyalar ve ignore kuralları incelendi → ✅
- Gerçek Firestore yazma testi → ❌ Yapılmadı (servis hesabı henüz yapılandırılmadı)
- Build / lint / test → ❌ Çalıştırılmadı

### Kalan
- Servis hesabı anahtarı oluşturulup `.env.local`'e girilecek
- İlk gerçek Firestore yazma testi yapılacak

---

## 2026-10-01 — Landing page

**Araç:** Claude (Codex)
**Süre:** ~45 dakika

### İstek
Firebase kurulumu tamamlandı; sıradaki adım olan landing page'e geç.

### AI önerisi → Kararım
- AI proje planını repo dışında tutmayı önerdi → **Reddettim**, `AKIS_PROJE_PLANI.md` olarak repo köküne kopyaladım; uygulama rehberi projeyle birlikte taşınsın.
- AI form bölümünü çalışır hâlde tasarladı → **Değiştirdim**: formu açıkça "hazırlanıyor" olarak bıraktım çünkü Firestore API'si olmadan sahte başarı mesajı göstermek istemiyorum.
- AI Türkçe sayfa dili ve metadata önerdi → **Kabul** ettim.

### Yapılan iş
- `src/app/page.tsx`: Varsayılan Next.js ekranı yerine Türkçe Akış landing page'i (hizmet tanıtımı, üç adımlı süreç, navigasyon ankorları)
- `src/app/globals.css`: Responsive layout, klavye focus göstergeleri, `prefers-reduced-motion` desteği
- `src/app/layout.tsx`: Türkçe `lang` ve metadata güncellendi
- Talep formu bilinçli olarak bağlanmadı; placeholder bırakıldı

### Doğrulama
- Kaynak dosyalar ve diff incelendi → ✅
- Build / lint / tarayıcı önizleme → ❌ Çalıştırılmadı

### Kalan
- Mobil navigasyon görünürlüğü kontrol edilecek
- Talep formu ve API route yapılacak

---

## 2026-10-01 — Mobil navigasyon ve renk paleti

**Araç:** Claude (Codex)
**Süre:** ~35 dakika

### İstek
Mobilde kaybolan navigasyon bağlantılarını açılır sidebar ile değiştir; sağlanan renk paletini tutarlı kullan.

### AI önerisi → Kararım
- AI modal yerine drawer sidebar önerdi → **Kabul** ettim; mobilde daha kullanışlı.
- AI geniş sidebar genişliği (90vw) önerdi → **Değiştirdim**: iPhone 14 ekran görüntüsüne bakarak `min(80vw, 320px)` olarak küçülttüm; satırları ve CTA'yı kısalttım.
- AI erişilebilirlik özellikleri önerdi (Escape, focus trap, body scroll lock, aria-expanded) → **Kabul** ettim, hepsi uygulandı.

### Yapılan iş
- `src/components/site-nav.tsx`: Erişilebilir mobil sidebar (menü butonu, backdrop, kapatma, Escape, focus trap, scroll lock). Desktop nav geniş ekranlarda olduğu gibi kalıyor.
- `public/color_palette.png`: Sağlanan palet görseli eklendi
- `src/app/globals.css`: CSS renkleri dört palet rengine (`#1B2923`, `#99A579`, `#F5F5EF`, `#CFED69`) ve alfa varyantlarına sınırlandı

### Doğrulama
- Kaynak dosyalar ve repo durumu incelendi → ✅
- Build / lint / tarayıcı önizleme → ❌ Çalıştırılmadı

---

## 2026-10-01 — Build düzeltmesi

**Araç:** Claude (Codex)
**Süre:** ~10 dakika

### İstek
Canlı sitede hata olabilir; production build'i kontrol et.

### AI önerisi → Kararım
- AI `ArrowIcon`'u ortak bir utils dosyasına taşımayı önerdi → **Reddettim**: kapsamı küçük tutmak için `page.tsx`'e yerel bir kopya ekledim; refactor sonraya bırakılabilir.

### Yapılan iş
- `src/app/page.tsx`: Sayfa-yerel `ArrowIcon` helper'ı geri eklendi (navigasyon bileşenine taşınmıştı ama sayfa CTA'sında hâlâ referans veriliyordu)

### Doğrulama
- İlk `npm run build` → ❌ TypeScript hatası (`ArrowIcon` bulunamadı)
- İkinci `npm run build` (düzeltme sonrası) → ✅ Başarılı (TypeScript + statik sayfa üretimi)

---

## 2026-10-01 — Sidebar CTA arka plan genişliği

**Araç:** Antigravity (Claude Opus)
**Süre:** ~5 dakika

### İstek
Mobil sidebar'da 03 "Birlikte konuşalım" butonunun koyu arka planı yarıda kesilmiş gibi görünüyor; arka planı genişlet ama 01/02/03 dikey hizalaması bozulmasın ve 02-03 arasına gereksiz boşluk girmesin.

### AI önerisi → Kararım
- AI negatif margin + dengeleyici padding tekniği önerdi (`margin-left/right: -20px`, `padding-left/right: 20px`) → **Kabul** ettim; basit, sidebar padding'ini aşarak arka planı kenardan kenara yayıyor ama metin hizası korunuyor.

### Yapılan iş
- `src/app/globals.css` → `.sidebar-cta` kuralına `margin-left: -20px; margin-right: -20px; padding-left: 20px; padding-right: 20px` eklendi

### Doğrulama
- `npm run build` → ✅ Başarılı
- Görsel kontrol → ⏳ Kullanıcı doğrulayacak

---

## 2026-10-01 — Talep formu ve Firestore API

**İstek:** Talep formunu ortak Zod doğrulaması, sunucu API'si ve Firestore kaydıyla tamamla.

### Yapılan iş
- `src/lib/services.ts`: Hizmet kimlikleri ve Türkçe başlıkları hem landing page hem formda kullanılacak şekilde ortaklaştırıldı.
- `src/lib/request-schema.ts`: İsim, e-posta, hizmet ve açıklama için trim/uzunluk/format doğrulaması eklendi.
- `src/app/api/requests/route.ts`: JSON content type, 16 KiB gövde sınırı, bozuk JSON, honeypot, Zod doğrulaması ve genel hata yanıtları eklendi. Firestore yazması tamamlanmadan `201` dönmüyor.
- `src/lib/server/request-repository.ts`: `requests/{id}` belgesini sunucu zaman damgası ve `new` durumuyla oluşturan repository eklendi.
- `src/components/request-form.tsx`: Alan hataları, ilk hatalı alana focus, gönderiliyor/başarı/hata durumları ve doğrulanmış kayıt numarası eklendi.
- `.env.local` içindeki Firebase Admin değişken adları bulundu; değerler açılmadı veya raporlanmadı.

### Doğrulama
- `npm run build` → ✅ Başarılı.
- `npm run lint` → ✅ Başarılı.
- Yerel API'de geçersiz payload → HTTP 400.
- Geçerli test talebinin Firestore yazma yanıtı yakalanamadı; doğrudan Firestore geri okuma denemesi de tamamlanmadı. Başarılı yazma doğrulanmış değil; zaman aşımından önce kayıt oluşmuş olabileceği için tekrar göndermeden önce Firestore Console kontrol edilmeli.
- Vitest testleri henüz eklenmedi/çalıştırılmadı; planın sonraki test aşamasında ele alınacak.

---

## 2026-10-01 — Scroll ve hover animasyonları

**Araç:** Antigravity (Claude Opus)
**Süre:** ~15 dakika

### İstek
Sayfadaki tüm yazılar ve bölümler scroll ile viewport'a girince animasyonlu gelsin; viewport'tan çıkıp tekrar girince animasyon tekrar tetiklensin. Hero kartları ve hizmet kartları hover'da yukarı kalksın.

### AI önerisi → Kararım
- AI önce custom IntersectionObserver ile Reveal component önerdi → **Değiştirdim**: kullanıcı "react animasyon kütüphanesi kullanabilirsin" dedi; Framer Motion'a geçtim.
- AI `framer-motion` paketi önerdi (`whileInView`, `whileHover`, `variants` API'leri) → **Kabul** ettim; scroll re-trigger (`once: false`) ve stagger animasyonları tek API'de temiz çözülüyor.
- AI hero kartlarını CSS hover ile yapmayı önerdi → **Değiştirdim**: kartlarda CSS `transform: rotate()` zaten var; framer-motion'ın `whileHover` ile `rotate` + `y` bağımsız kontrol daha güvenli.
- AI hizmet kartlarında `staggerChildren: 0.12` önerdi → **Kabul** ettim; 3 kart sırayla belirmesi görsel olarak daha iyi.

### Yapılan iş
- `framer-motion` paketi kuruldu
- `src/components/reveal.tsx`: `motion.div` + `whileInView` ile genel scroll reveal wrapper (up/down/left/right/scale varyantları, delay desteği)
- `src/components/hero-cards.tsx`: Hero kartları client component; `whileHover` ile spring animasyonlu yukarı kalkma + rotasyon
- `src/components/service-grid.tsx`: Hizmet kartları stagger animasyonlu scroll reveal + `whileHover` lift efekti
- `src/components/steps-list.tsx`: Süreç adımları stagger animasyonlu sağdan kayma
- `src/app/page.tsx`: Tüm bölümlere Reveal wrapper'ları eklendi (hero text → staggered, hero art → soldan, hizmet başlığı, süreç başlığı, iletişim, footer)
- `src/app/globals.css`: Flow card hover shadow, service card transition, step hover highlight eklendi

### Doğrulama
- İlk `npm run build` → ❌ TypeScript hatası (`springTransition.type` string literal gerekiyor)
- `as const` assertion ile düzeltme → `npm run build` → ✅ Başarılı
- Tarayıcı görsel kontrol → ⏳ Kullanıcı doğrulayacak

---

## 2026-10-01 — Form durumları, E2E testleri ve hata yönetimi düzenlemesi

**Araç:** Antigravity (Gemini 3.8 Flash)
**Süre:** ~20 dakika

### İstek
Talep formunun E2E testlerini gerçekleştir; HTTP 200/201, 400, 413, 415, 500 status durumlarını ve hata çıktılarını kontrol edip form hata yönetimini bu durumlara göre düzenle.

### AI önerisi → Kararım
- AI tüm hata durumlarında tek bir genel catch-all mesaj göstermeyi öneriyordu → **Değiştirdim**: HTTP 400 (doğrulama/honeypot), 413 (boyut aşımı), 415 (JSON format hatası), 500 (sunucu/veritabanı hatası) için sunucudan dönen gerçek hata mesajını ekranda gösterdim; ağ/timeout hatasını ise yalnızca gerçek bağlantı kesintilerinde gösterilecek şekilde ayırdım.
- AI testleri sadece manuel yapmayı önerdi → **Değiştirdim**: Hem canlı HTTP endpoint üzerinde 9 senaryolu E2E test koşusu yaptım hem de `vitest` ile 14 birim/entegrasyon testi ekledim.
- AI `package.json` script'lerini olduğu gibi bırakmayı önerdi → **Reddettim**: Plan doğrultusunda `test` ve `typecheck` scriptlerini ekledim.

### Yapılan iş
- `src/components/request-form.tsx`: Status kodlarına (201, 400, 413, 415, 500) ve sunucudan dönen `error` metnine göre durum mesajı yönetimi eklendi; AbortError (zaman aşımı) ve ağ hatası durumları ayrıştırıldı.
- `package.json`: `test: "vitest run"` ve `typecheck: "tsc --noEmit"` komutları eklendi.
- `vitest.config.mjs`: Test ortamı ve `@/*` alias çözünürlüğü yapılandırıldı.
- `tests/request-schema.test.ts`: Şema doğrulaması için 8 test (geçerli veri, trim, kısa isim, uzun isim, hatalı e-posta, tanımsız hizmet, kısa/uzun açıklama) eklendi.
- `tests/requests-route.test.ts`: API route davranışı için 6 test (415, 400 bozuk JSON, 400 honeypot, 400 validation, 201 success, 500 DB error güvenli mesaj) eklendi.

### Doğrulama
- Canlı E2E HTTP Testleri (9 senaryo):
  - 415 Unsupported Media Type → ✅ Geçti
  - 413 Payload Too Large (>16KiB) → ✅ Geçti
  - 400 Malformed JSON Syntax → ✅ Geçti
  - 400 Honeypot Bot Tespiti → ✅ Geçti
  - 400 Şema / Validasyon Hataları (kısa ad, hatalı mail, geçersiz servis, kısa açıklama) → ✅ Geçti
  - 201 Created & Gerçek Firestore Belge ID Üretimi → ✅ Geçti
- `npm run test` → ✅ 2 test dosyası, 14 testin tamamı başarılı (14/14)
- `npm run typecheck` → ✅ Sıfır hata
- `npm run lint` → ✅ Sıfır hata
- `npm run build` → ✅ Başarılı (statik sayfalar + dynamic route derlendi)
