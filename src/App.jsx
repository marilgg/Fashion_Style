
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
        <section className="hero" id="inicio">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />

          <div className="hero-copy">
            <span className="eyebrow">
              <Sprout size={16} /> VISTE EL CAMBIO
            </span>

            <h1>
              Tu estilo.
              <br />
              <span>Un futuro</span>
              <br />
              más consciente.
            </h1>

            <p>
              La moda puede expresar quién eres sin dejar de cuidar
              el planeta. Descubre cómo transformar tu manera de vestir,
              una decisión a la vez.
            </p>

            <div className="hero-actions">
              <button className="button-primary" onClick={() => goTo("sostenibilidad")}>
                Descubrir cómo <ArrowRight size={17} />
              </button>
              <button className="button-secondary" onClick={() => goTo("donaciones")}>
                Dar una segunda oportunidad
              </button>
            </div>

            <div className="hero-note">
              <span className="note-icon"><Leaf size={17} /></span>
              <span>Menos desperdicio. Más creatividad. Más vida.</span>
            </div>
          </div>

          <div className="hero-art" aria-label="Ilustración de moda sostenible">
            <div className="art-ring" />
            <div className="art-card art-card-back">
              <span>RETHINK</span>
              <Recycle size={30} />
            </div>
            <div className="fashion-figure">
              <div className="figure-head" />
              <div className="figure-hair" />
              <div className="figure-neck" />
              <div className="figure-body">
                <div className="figure-shirt" />
                <div className="figure-jacket" />
              </div>
              <div className="figure-skirt" />
              <div className="figure-leg figure-leg-one" />
              <div className="figure-leg figure-leg-two" />
              <div className="figure-bag"><Leaf size={23} /></div>
            </div>
            <div className="art-card art-card-front">
              <Leaf size={20} />
              <span>STYLE WITH PURPOSE</span>
              <strong>01 / 03</strong>
            </div>
            <span className="art-star star-one">✳</span>
            <span className="art-star star-two">✳</span>
          </div>

          <div className="hero-bottom">
            <span>MODA CIRCULAR</span>
            <span>CONSUMO RESPONSABLE</span>
            <span>IMPACTO POSITIVO</span>
          </div>
        </section>

        <section className="intro-section">
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
