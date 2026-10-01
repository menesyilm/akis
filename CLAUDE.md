@AGENTS.md

# AI_LOG.md Güncelleme Talimatı

Her aşama tamamlandığında AI_LOG.md dosyasına aşağıdaki formatta yeni girdi ekle. Mevcut girdilerin formatını bozmadan dosyanın sonuna ekle.

## Zorunlu Format

```markdown
## YYYY-AA-GG — [Aşama başlığı]

**Araç:** [Kullanılan AI aracı: Claude Codex / Antigravity / vb.]
**Süre:** ~XX dakika

### İstek
[Ne istendi? 1-2 cümle]

### AI önerisi → Kararım
- AI [X önerdi] → **Kabul** ettim çünkü [gerekçe].
- AI [Y önerdi] → **Değiştirdim**: [ne yaptım] çünkü [gerekçe].
- AI [Z önerdi] → **Reddettim** çünkü [gerekçe].

### Yapılan iş
- [Dosya yolu]: [Ne yapıldı, 1 cümle]

### Doğrulama
- [Kontrol] → ✅ / ❌ [sonuç]

### Kalan
- [Varsa sonraki adımda yapılacaklar]
```

## Kurallar

1. **Paragraf yazma, madde yaz.** Her madde 1-2 cümle.
2. **Araç ve süreyi her girdide belirt.**
3. **Kabul/değiştirme/red ayrımını açıkça yaz.** Değerlendirici bunu arıyor.
4. **Doğrulama sonucunu somut yaz.** "Test çalıştırdım" değil → "8/8 test geçti".
5. **Yapılmayan kontrolü yapılmış yazma.** Beklemedeyse "⏳ Beklemede" yaz.
6. **Hata uydurmama.** Hata bulmadıysan "hata bulunamadı" yaz.
7. **Çalışırken yaz.** Sonradan kusursuz hikâye oluşturma.
8. **Her commit = bir AI_LOG girdisi.**
