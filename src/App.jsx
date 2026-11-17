
import { useState } from "react";
import {
  Menu,
  X,
  Leaf,
  ArrowRight,
  Heart,
  Recycle,
  Sparkles,
  Shirt,
  MessageCircle,
  Sprout
} from "lucide-react";

const sections = [
  { id: "inicio", label: "Inicio" },
  { id: "donaciones", label: "Donaciones" },
  { id: "sostenibilidad", label: "Sostenibilidad" },
  { id: "campanas", label: "Campañas" },
  { id: "asistente", label: "Asistente IA" }
];

const features = [
  {
    icon: Heart,
    number: "01",
    title: "Dona con propósito",
    description:
      "Comparte las prendas que ya no necesitas y ayuda a prolongar su vida útil.",
    link: "donaciones",
    action: "Quiero donar"
  },
  {
    icon: Recycle,
    number: "02",
    title: "Dale otra vida",
    description:
      "Descubre ideas creativas para reparar, transformar y reutilizar tu ropa.",
    link: "sostenibilidad",
    action: "Explorar ideas"
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Inspírate con IA",
    description:
      "Encuentra ideas personalizadas para combinar y aprovechar tus prendas.",
    link: "asistente",
    action: "Conocer asistente"
  }
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  function goTo(id) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  return (
    <div className="site-shell">
      <div className="announcement">
        MODA CONSCIENTE, CAMBIOS REALES
        <span>Una prenda puede tener muchas vidas.</span>
      </div>

      <header className="site-header">
        <button
          className="brand"
          onClick={() => goTo("inicio")}
          aria-label="Ir al inicio"
        >
          <span className="brand-mark"><Leaf size={23} /></span>
          <span>
            <strong>fashion style</strong>
            <small>WEAR THE CHANGE</small>
          </span>
        </button>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? "navigation navigation-open" : "navigation"}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => goTo(section.id)}
            >
              {section.label}
            </button>
          ))}
          <button
            className="nav-cta"
            onClick={() => goTo("donaciones")}
          >
            Ser parte <ArrowRight size={15} />
          </button>
        </nav>
      </header>

      <main>
        
          <div className="section-kicker">UNA NUEVA FORMA DE MIRAR TU ARMARIO</div>
          <h2>
            No necesitas más ropa.
            <br />
            <span>Necesitas nuevas posibilidades.</span>
          </h2>
          <p>
            Fashion Style conecta la creatividad con la sostenibilidad para
            ayudarte a aprovechar lo que ya tienes, compartir lo que no usas
            y tomar decisiones más conscientes.
          </p>
        </section>

<section className="hero hero-editorial" id="inicio">
  <div className="hero-editorial-inner">
    <div className="hero-copy hero-editorial-copy">
      <div className="hero-editorial-kicker">
        <span className="hero-kicker-dot"></span>
        MODA CONSCIENTE · UNA NUEVA HISTORIA
      </div>

      <h1>
        Viste lo que eres.
        <span>Cuida lo que viene.</span>
      </h1>

      <p>
        Tu estilo puede marcar la diferencia. Descubre nuevas formas
        de reutilizar, compartir y transformar la moda en algo
        positivo para el planeta.
      </p>

      <div className="hero-actions">
        <button
          className="button-primary"
          onClick={() => goTo("sostenibilidad")}
        >
          Explorar el cambio <ArrowRight size={17} />
        </button>

        <button
          className="button-secondary"
          onClick={() => goTo("donaciones")}
        >
          Quiero donar
        </button>
      </div>

      <div className="hero-mini-stats">
        <div>
          <strong>01</strong>
          <span>REUTILIZA</span>
        </div>
        <div>
          <strong>02</strong>
          <span>REINVENTA</span>
        </div>
        <div>
          <strong>03</strong>
          <span>TRANSFORMA</span>
        </div>
      </div>
    </div>

    <div className="hero-editorial-art">
      <div className="editorial-orbit"></div>

      <div className="editorial-poster">
        <div className="poster-top">
          <span>FASHION STYLE / EST. 2026</span>
          <span>01 — 03</span>
        </div>

        <div className="poster-title">
          <span>RE</span>
          <span className="poster-title-accent">IMAGINA.</span>
        </div>

        <div className="poster-icon-wrap">
          <Recycle size={100} strokeWidth={1} />
        </div>

        <div className="poster-swatch-row">
          <span className="swatch swatch-one"></span>
          <span className="swatch swatch-two"></span>
          <span className="swatch swatch-three"></span>
          <span className="swatch swatch-four"></span>
          <span className="swatch-caption">EVERY THREAD HAS A STORY</span>
        </div>

        <div className="poster-footer">
          <span>WEAR THE CHANGE</span>
          <span>MODA CIRCULAR</span>
        </div>
      </div>

      <div className="editorial-float editorial-float-one">
        <Leaf size={19} />
        <span>SEGUNDA VIDA</span>
      </div>

      <div className="editorial-float editorial-float-two">
        <Sparkles size={18} />
        <span>ESTILO CON PROPÓSITO</span>
      </div>
    </div>
  </div>

  <div className="hero-editorial-bottom">
    <span>MODA CIRCULAR</span>
    <span>CONSUMO RESPONSABLE</span>
    <span>UN FUTURO MÁS CONSCIENTE</span>
  </div>
</section>
        <section className="features-section" id="sostenibilidad">
          <div className="section-heading">
            <div>
              <div className="section-kicker">PEQUEÑAS ACCIONES, GRAN PROPÓSITO</div>
              <h2>Empieza por algo <span>bonito.</span></h2>
            </div>
            <p>El cambio no tiene que ser complicado. Empieza a tu manera.</p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article className="feature-card" key={feature.number}>
                  <div className="feature-top">
                    <span className="feature-icon"><Icon size={23} /></span>
                    <span className="feature-number">{feature.number}</span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <button className="text-link" onClick={() => goTo(feature.link)}>
                    {feature.action} <ArrowRight size={16} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="donation-banner" id="donaciones">
          <div className="banner-icon"><Shirt size={34} /></div>
          <div>
            <div className="section-kicker">TU ARMARIO PUEDE CAMBIAR UNA HISTORIA</div>
            <h2>Lo que ya no usas puede ser el comienzo de alguien más.</h2>
            <p>
              Conoce cómo preparar tus prendas y registrar tu intención de donar.
            </p>
          </div>
          <button className="button-light" onClick={() => goTo("campanas")}>
            Conocer iniciativas <ArrowRight size={17} />
          </button>
        </section>

        <section className="ai-banner" id="asistente">
          <div className="ai-decoration"><MessageCircle size={42} /></div>
          <div>
            <div className="section-kicker">IDEAS QUE SE ADAPTAN A TI</div>
            <h2>¿Y si tu ropa tuviera otra historia?</h2>
            <p>
              Estamos preparando un asistente que te ayude a descubrir
              nuevas posibilidades para tus prendas.
            </p>
          </div>
          <button className="button-primary" onClick={() => goTo("contacto")}>
            Quiero saber más <ArrowRight size={17} />
          </button>
        </section>

        <section className="campaign-section" id="campanas">
          <div className="section-kicker">LA MODA TAMBIÉN NOS CONECTA</div>
          <h2>Los cambios son mejores <span>cuando se comparten.</span></h2>
          <p>
            Explora las iniciativas de Fashion Style y encuentra maneras
            de participar en una cultura de consumo más responsable.
          </p>
          <button className="button-primary" onClick={() => goTo("contacto")}>
            Conocer las iniciativas <ArrowRight size={17} />
          </button>
        </section>

        <section className="contact-section" id="contacto">
          <div>
            <div className="section-kicker">HAGAMOS ALGO DIFERENTE</div>
            <h2>Tu idea también puede inspirar.</h2>
            <p>
              Explora nuestras páginas de campañas y donaciones para conocer
              las opciones disponibles en Fashion Style.
            </p>
          </div>
          <div className="contact-links">
            <a href="./donaciones.html">Página de donaciones ↗</a>
            <a href="./sostenibilidad.html">Guía de sostenibilidad ↗</a>
            <a href="./campanas.html">Campañas e iniciativas ↗</a>
            <a href="./ia.html">Asistente de IA ↗</a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <button className="brand footer-brand" onClick={() => goTo("inicio")}>
          <span className="brand-mark"><Leaf size={21} /></span>
          <span><strong>fashion style</strong><small>WEAR THE CHANGE</small></span>
        </button>
        <p>Moda consciente para un futuro que nos incluya a todos.</p>
        <span>© {new Date().getFullYear()} Fashion Style</span>
      </footer>
    </div>
  );
}

export default App;
