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
