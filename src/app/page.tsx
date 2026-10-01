import SiteNav from "@/components/site-nav";
import RequestForm from "@/components/request-form";
import { services } from "@/lib/services";

const steps = [
  {
    number: "01",
    title: "İhtiyacını anlat",
    description: "Bugün zamanınızı alan tekrar eden işleri birlikte belirleyelim.",
  },
  {
    number: "02",
    title: "Birlikte değerlendirelim",
    description: "Sürecinizi anlayıp otomasyona uygun noktaları netleştirelim.",
  },
  {
    number: "03",
    title: "Çözümü planlayalım",
    description: "İşinize uyacak sade ve uygulanabilir bir yol haritası çıkaralım.",
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h11M10 4l6 6-6 6" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#baslangic" aria-label="Akış ana sayfa">
          <span className="brand-mark" aria-hidden="true">
            a<span>.</span>
          </span>
          <span>akış</span>
        </a>

        <SiteNav />
      </header>

      <section className="hero" id="baslangic" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Küçük işler, daha akıcı bir gün</p>
          <h1 id="hero-title">
            Tekrar eden işleri
            <br />
            <span>otomatikleştirin.</span>
          </h1>
          <p className="hero-description">
            Sipariş takibi, raporlama ve günlük görevler daha düzenli ilerlesin.
            Siz işinize zaman ayırın.
          </p>
          <a className="button button-dark" href="#talep">
            İhtiyacını anlat <ArrowIcon />
          </a>
          <div className="hero-note">
            <span className="note-line" />
            İşletmenize göre şekillenen pratik çözümler
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="flow-card card-back">
            <span className="flow-label">BUGÜNÜN AKIŞI</span>
            <span className="flow-line"><i /> Sipariş alındı</span>
            <span className="flow-line"><i /> Rapor hazırlandı</span>
            <span className="flow-line"><i /> Görev hatırlatıldı</span>
          </div>
          <div className="flow-card card-front">
            <span className="card-spark">✳</span>
            <span className="flow-label">DAHA AZ TEKRAR</span>
            <strong>Daha çok<br />işinize odaklanın.</strong>
            <span className="card-footer"><span /> Akışınız düzene giriyor</span>
          </div>
          <span className="art-dot dot-one" />
          <span className="art-dot dot-two" />
          <span className="art-cross">＋</span>
        </div>

        <div className="hero-bottom" aria-hidden="true">
          <span>İşin akışını iyileştir</span>
          <span className="hero-bottom-line" />
          <span>01 — 03</span>
        </div>
      </section>

      <section className="services section-wrap" id="hizmetler" aria-labelledby="services-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> Neler kolaylaşabilir?</p>
            <h2 id="services-title">İşin akışını<br />birlikte <em>iyileştirelim.</em></h2>
          </div>
          <p className="section-intro">
            Her işletmenin iş yapış biçimi farklı. Tekrarlanan adımları
            anlayıp size uygun otomasyon fırsatlarını birlikte bulalım.
          </p>
        </div>

        <div className="service-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service.id}>
              <div className="service-card-top">
                <span className="service-number">0{index + 1}</span>
                <span className="service-icon" aria-hidden="true">{service.icon}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="service-rule" />
            </article>
          ))}
        </div>
      </section>

      <section className="process" id="surec" aria-labelledby="process-title">
        <div className="section-wrap process-inner">
          <div className="process-heading">
            <p className="eyebrow eyebrow-light"><span /> Karmaşık değil, birlikte</p>
            <h2 id="process-title">Önce sizi<br /><em>dinliyoruz.</em></h2>
            <p>İyi bir çözüm, işinizin bugün nasıl yürüdüğünü anlamakla başlar.</p>
          </div>
          <ol className="steps-list">
            {steps.map((step) => (
              <li className="step" key={step.number}>
                <span className="step-number">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                <span className="step-arrow" aria-hidden="true">↗</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="contact section-wrap" id="talep" aria-labelledby="contact-title">
        <div className="contact-copy">
          <p className="eyebrow"><span /> İlk adım sizden</p>
          <h2 id="contact-title">İşinizi kolaylaştıracak<br /><em>bir yerden başlayalım.</em></h2>
          <p>İhtiyacınızı anlatın; size uygun olabilecek adımları birlikte değerlendirelim.</p>
        </div>
        <RequestForm />
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#baslangic" aria-label="Akış sayfa başına dön">
          <span className="brand-mark" aria-hidden="true">a<span>.</span></span>
          <span>akış</span>
        </a>
        <p>Tekrarlayan işleri otomatikleştirin, işinize zaman ayırın.</p>
        <a href="#baslangic" className="back-top">Başa dön ↑</a>
        <span className="footer-note">Kurgusal değerlendirme projesi</span>
      </footer>
    </main>
  );
}
