import SiteNav from "@/components/site-nav";
import Reveal from "@/components/reveal";
import HeroCards from "@/components/hero-cards";
import ServiceGrid from "@/components/service-grid";
import StepsList from "@/components/steps-list";
import RequestForm from "@/components/request-form";

const services = [
  {
    number: "01",
    title: "Sipariş takibi",
    description:
      "Farklı kanallardan gelen siparişleri tek bir akışta toplayın. Ekibiniz, her işin hangi aşamada olduğunu kolayca görsün.",
    icon: "↗",
  },
  {
    number: "02",
    title: "Raporlama",
    description:
      "Tekrarlanan rapor hazırlığını otomatikleştirin. İhtiyacınız olan bilgiler, doğru zamanda ve düzenli biçimde elinizde olsun.",
    icon: "▤",
  },
  {
    number: "03",
    title: "Görev ve hatırlatma",
    description:
      "İşleri doğru kişiye, doğru zamanda ulaştırın. Takip gerektiren adımlar gözden kaçmasın.",
    icon: "◷",
  },
];

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
          <Reveal>
            <p className="eyebrow"><span /> Küçük işler, daha akıcı bir gün</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 id="hero-title">
              Tekrar eden işleri
              <br />
              <span>otomatikleştirin.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="hero-description">
              Sipariş takibi, raporlama ve günlük görevler daha düzenli ilerlesin.
              Siz işinize zaman ayırın.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <a className="button button-dark" href="#talep">
              İhtiyacını anlat <ArrowIcon />
            </a>
            <div className="hero-note">
              <span className="note-line" />
              İşletmenize göre şekillenen pratik çözümler
            </div>
          </Reveal>
        </div>

        <Reveal variant="left" delay={0.2}>
          <HeroCards />
        </Reveal>

        <div className="hero-bottom" aria-hidden="true">
          <span>İşin akışını iyileştir</span>
          <span className="hero-bottom-line" />
          <span>01 — 03</span>
        </div>
      </section>

      <section className="services section-wrap" id="hizmetler" aria-labelledby="services-title">
        <Reveal>
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
        </Reveal>

        <ServiceGrid services={services} />
      </section>

      <section className="process" id="surec" aria-labelledby="process-title">
        <div className="section-wrap process-inner">
          <Reveal>
            <div className="process-heading">
              <p className="eyebrow eyebrow-light"><span /> Karmaşık değil, birlikte</p>
              <h2 id="process-title">Önce sizi<br /><em>dinliyoruz.</em></h2>
              <p>İyi bir çözüm, işinizin bugün nasıl yürüdüğünü anlamakla başlar.</p>
            </div>
          </Reveal>
          <StepsList steps={steps} />
        </div>
      </section>

      <section className="contact section-wrap" id="talep" aria-labelledby="contact-title">
        <Reveal>
          <div className="contact-copy">
            <p className="eyebrow"><span /> İlk adım sizden</p>
            <h2 id="contact-title">İşinizi kolaylaştıracak<br /><em>bir yerden başlayalım.</em></h2>
            <p>İhtiyacınızı anlatın; size uygun olabilecek adımları birlikte değerlendirelim.</p>
          </div>
        </Reveal>
        <Reveal variant="scale" delay={0.15}>
          <div className="contact-panel">
            <RequestForm />
          </div>
        </Reveal>
      </section>

      <Reveal>
        <footer className="site-footer">
          <a className="brand footer-brand" href="#baslangic" aria-label="Akış sayfa başına dön">
            <span className="brand-mark" aria-hidden="true">a<span>.</span></span>
            <span>akış</span>
          </a>
          <p>Tekrarlayan işleri otomatikleştirin, işinize zaman ayırın.</p>
          <a href="#baslangic" className="back-top">Başa dön ↑</a>
          <span className="footer-note">Kurgusal değerlendirme projesi</span>
        </footer>
      </Reveal>
    </main>
  );
}
