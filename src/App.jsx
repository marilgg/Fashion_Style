
import { useEffect, useState } from "react";
import {
  listarProductos,
  enviarDonacion,
  enviarContacto
} from "./api.js";

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
  Sprout,
  Search,
  House,
  ShoppingBag,
  HandHeart,
  Megaphone,
  Mail,
  Send,
  Flower2
} from "lucide-react";

const navItems = [
  { id: "inicio", label: "Inicio", icon: House },
  { id: "catalogo", label: "Catálogo", icon: ShoppingBag },
  { id: "donaciones", label: "Donaciones", icon: HandHeart },
  { id: "sostenibilidad", label: "Sostenibilidad", icon: Leaf },
  { id: "campanas", label: "Campañas", icon: Megaphone },
  { id: "asistente", label: "Asistente IA", icon: Sparkles },
  { id: "contacto", label: "Contacto", icon: Mail }
];

const demoProducts = [
  {
    id: 1,
    name: "Camisa de lino",
    category: "Camisas",
    condition: "Excelente",
    color: "#e9dfd1",
    description: "Una prenda versátil que merece seguir acompañándote."
  },
  {
    id: 2,
    name: "Chaqueta clásica",
    category: "Chaquetas",
    condition: "Muy buena",
    color: "#d9c8e4",
    description: "Abrigos con estilo y nuevas oportunidades."
  },
  {
    id: 3,
    name: "Denim circular",
    category: "Pantalones",
    condition: "Excelente",
    color: "#c5d5db",
    description: "El denim nunca pasa de moda. Dale otra vuelta."
  },
  {
    id: 4,
    name: "Vestido floral",
    category: "Vestidos",
    condition: "Muy buena",
    color: "#e7d1d5",
    description: "Una historia que puede continuar en otro armario."
  },
  {
    id: 5,
    name: "Suéter tejido",
    category: "Suéteres",
    condition: "Excelente",
    color: "#d8e0d1",
    description: "Suave, atemporal y listo para una nueva temporada."
  },
  {
    id: 6,
    name: "Bolso reutilizable",
    category: "Accesorios",
    condition: "Muy buena",
    color: "#e4d9bf",
    description: "Pequeños detalles que hacen parte de un gran cambio."
  }
];

const categories = [
  "Todas",
  "Blusas",
  "Camisas",
  "Chaquetas",
  "Pantalones",
  "Vestidos",
  "Suéteres",
  "Accesorios"
];

function App() {
  const [page, setPage] = useState("inicio");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");

  const [donationSent, setDonationSent] = useState(false);
  const [donationLoading, setDonationLoading] = useState(false);
  const [donationError, setDonationError] = useState("");

  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");

  const [chatMessages, setChatMessages] = useState([
    {
      role: "bot",
      text: "¡Hola! Soy el asistente de Fashion Style. Puedo contarte sobre moda circular, donaciones y cuidado de prendas. ¿Qué te gustaría saber?"
    }
  ]);

  const [chatInput, setChatInput] = useState("");

  // Estados del catálogo conectado al backend
  const [products, setProducts] = useState(demoProducts);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  // Consultar productos desde Render
  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const data = await listarProductos();

        if (!Array.isArray(data)) {
          throw new Error("La respuesta del servidor no es válida");
        }

        const adaptedProducts = data.map((product, index) => ({
          id: product.id,
          name: product.nombre,
          category: product.categoria,
          condition: "Disponible",
          color: ["#e9dfd1", "#d9c8e4", "#c5d5db"][index % 3],
          description: "Una prenda que puede tener una nueva historia."
        }));

        if (active) {
          setProducts(adaptedProducts);
          setProductsError("");
        }
      } catch (error) {
        if (active) {
          setProductsError(
            "No fue posible actualizar el catálogo. Mostramos los productos de ejemplo."
          );
        }
      } finally {
        if (active) {
          setProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  function navigate(id) {
    setPage(id);
    setMenuOpen(false);
    setSearch("");
    setCategory("Todas");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Enviar donación al backend
  async function submitDonation(e) {
    e.preventDefault();

    if (donationLoading) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const datos = {
      nombre: formData.get("name"),
      correo: formData.get("email"),
      tipo: formData.get("type"),
      cantidad: formData.get("quantity")
    };

    setDonationLoading(true);
    setDonationError("");
    setDonationSent(false);

    try {
      await enviarDonacion(datos);

      setDonationSent(true);
      form.reset();
    } catch (error) {
      setDonationError(
        error.message ||
        "No fue posible enviar la donación. Inténtalo nuevamente."
      );
    } finally {
      setDonationLoading(false);
    }
  }

  // Enviar contacto al backend
  async function submitContact(e) {
    e.preventDefault();

    if (contactLoading) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const datos = {
      nombre: formData.get("name"),
      correo: formData.get("email"),
      asunto: formData.get("subject"),
      mensaje: formData.get("message")
    };

    setContactLoading(true);
    setContactError("");
    setContactSent(false);

    try {
      await enviarContacto(datos);

      setContactSent(true);
      form.reset();
    } catch (error) {
      setContactError(
        error.message ||
        "No fue posible enviar el mensaje. Inténtalo nuevamente."
      );
    } finally {
      setContactLoading(false);
    }
  }

  function sendChat(e) {
    e.preventDefault();

    if (!chatInput.trim()) return;

    const question = chatInput.trim();

    setChatMessages(prev => [
      ...prev,
      { role: "user", text: question },
      { role: "bot", text: getReply(question) }
    ]);

    setChatInput("");
  }

  function getReply(question) {
    const q = question.toLowerCase();

    if (q.includes("don") || q.includes("entregar")) {
      return "¡Qué bueno que quieras donar! En Fashion Style buscamos prolongar la vida de las prendas. Ve a la sección Donaciones para conocer cómo registrar tu intención de donar.";
    }

    if (q.includes("lav") || q.includes("cuid") || q.includes("mancha")) {
      return "Para cuidar tu ropa, revisa primero la etiqueta, utiliza ciclos suaves cuando sea posible, evita lavar innecesariamente y deja secar las prendas de forma adecuada. ¡Cuidarlas ayuda a que duren más!";
    }

    if (
      q.includes("recicl") ||
      q.includes("sosten") ||
      q.includes("reutil")
    ) {
      return "La moda circular busca reducir residuos prolongando la vida de los productos. Puedes reparar, intercambiar, reutilizar, donar o transformar prendas. ¡Mira nuestra sección de Sostenibilidad!";
    }

    if (
      q.includes("catálogo") ||
      q.includes("ropa") ||
      q.includes("prenda")
    ) {
      return "Puedes explorar nuestro catálogo desde el menú. Encontrarás diferentes categorías de prendas y algunas ideas para darles una segunda vida.";
    }

    return "¡Gracias por tu pregunta! Soy la versión inicial del asistente de Fashion Style. Puedo ayudarte con donaciones, sostenibilidad, cuidado de ropa y reutilización. Prueba preguntándome por alguno de esos temas.";
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      category === "Todas" || product.category === category;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  function PageHeading({ eyebrow, title, description }) {
    return (
      <div className="page-heading">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    );
  }

  function Home() {
    return (
      <>
        <section className="home-hero">
          <div className="hero-content">
            <span className="eyebrow">
              <Leaf size={15} /> MODA CONSCIENTE · CAMBIOS REALES
            </span>

            <h1>
              Tu estilo.<br />
              <em>Un futuro mejor.</em>
            </h1>

            <p>
              La ropa que amas puede tener muchas vidas. Descubre una nueva
              manera de vestir, compartir y cuidar el planeta.
            </p>

            <div className="hero-buttons">
              <button
                className="btn btn-dark"
                onClick={() => navigate("catalogo")}
              >
                Explorar prendas <ArrowRight size={16} />
              </button>

              <button
                className="btn btn-outline"
                onClick={() => navigate("donaciones")}
              >
                Quiero donar
              </button>
            </div>

            <div className="hero-note">
              <Sprout size={18} /> Pequeñas decisiones, grandes cambios.
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-art-circle" />
            <div className="hero-art-label">
              WEAR<br />THE CHANGE
            </div>
            <div className="hero-art-number">FS—026</div>

            <div className="hero-art-card">
              <div className="art-tag">
                CIRCULAR<br />FASHION
              </div>
              <Shirt size={115} strokeWidth={0.85} />
              <div className="art-bottom">
                PRE-LOVED<br />RE-IMAGINED
              </div>
            </div>

            <div className="art-floating">
              <Recycle size={21} />
              <span>DALE OTRA VIDA</span>
            </div>

            <div className="art-sticker">
              <span>LESS</span>
              <span>WASTE</span>
              <span>MORE</span>
              <span>STYLE</span>
            </div>
          </div>
        </section>

        <section className="home-strip">
          <span>VISTE CON PROPÓSITO</span>
          <span>✳</span>
          <span>REUTILIZA</span>
          <span>✳</span>
          <span>TRANSFORMA</span>
          <span>✳</span>
          <span>COMPARTE</span>
        </section>

        <section className="home-discover section-pad">
          <div className="discover-copy">
            <span className="eyebrow">DESCUBRE FASHION STYLE</span>
            <h2>
              No es solo lo que vistes.<br />
              <em>Es lo que decides.</em>
            </h2>
            <p>
              Creemos que el cambio comienza cuando miramos lo que tenemos
              con nuevos ojos. Una prenda puede ser una oportunidad para
              crear, compartir y transformar.
            </p>
          </div>

          <div className="discover-grid">
            <button
              className="discover-card discover-donate"
              onClick={() => navigate("donaciones")}
            >
              <Heart size={25} />
              <span>COMPARTE LO QUE YA NO USAS</span>
              <strong>Dona con propósito</strong>
              <ArrowRight />
            </button>

            <button
              className="discover-card discover-reuse"
              onClick={() => navigate("sostenibilidad")}
            >
              <Recycle size={25} />
              <span>CREA NUEVAS POSIBILIDADES</span>
              <strong>Dale otra vida</strong>
              <ArrowRight />
            </button>

            <button
              className="discover-card discover-ai"
              onClick={() => navigate("asistente")}
            >
              <Sparkles size={25} />
              <span>IDEAS QUE TE INSPIRAN</span>
              <strong>Explora con IA</strong>
              <ArrowRight />
            </button>
          </div>
        </section>

        <section className="home-quote">
          <Flower2 size={32} />
          <p>
            “El cambio no siempre comienza con algo nuevo. A veces comienza
            con mirar diferente lo que ya tenemos.”
          </p>
          <span>FASHION STYLE</span>
        </section>

        <section className="home-bottom-cta">
          <div>
            <span className="eyebrow">TU HISTORIA TAMBIÉN CUENTA</span>
            <h2>
              Hagamos que la moda<br />
              <em>tenga un propósito.</em>
            </h2>
          </div>

          <button
            className="btn btn-light"
            onClick={() => navigate("campanas")}
          >
            Conoce nuestras iniciativas <ArrowRight size={16} />
          </button>
        </section>
      </>
    );
  }

  function Catalog() {
    return (
      <section className="page-section catalog-page">
        <PageHeading
          eyebrow="PRENDAS CON OTRA HISTORIA"
          title={<>Explora el <em>catálogo.</em></>}
          description="Descubre prendas, ideas y posibilidades. La moda circular empieza cuando algo puede continuar."
        />

        <div className="catalog-tools">
          <div className="search-box">
            <Search size={17} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar prendas..."
            />
          </div>

          <div className="category-list">
            {categories.map(cat => (
              <button
                key={cat}
                className={category === cat ? "category-active" : ""}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {productsLoading && (
          <div className="empty-state">
            Cargando catálogo...
          </div>
        )}

        {productsError && (
          <div className="catalog-note">
            {productsError}
          </div>
        )}

        {!productsLoading && (
          <>
            <div className="product-grid">
              {filteredProducts.map(product => (
                <article className="product-card" key={product.id}>
                  <div
                    className="product-art"
                    style={{ background: product.color }}
                  >
                    <span className="product-number">
                      FS / {String(product.id).padStart(2, "0")}
                    </span>

                    <Shirt size={100} strokeWidth={0.85} />

                    <span className="product-tag">
                      CIRCULAR SELECTION
                    </span>
                  </div>

                  <div className="product-info">
                    <span className="product-category">
                      {product.category} · {product.condition}
                    </span>

                    <h3>{product.name}</h3>

                    <p>{product.description}</p>

                    <button
                      className="product-action"
                      onClick={() => navigate("donaciones")}
                    >
                      Conocer cómo participar <ArrowRight size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="empty-state">
                No encontramos prendas con esa búsqueda.
              </div>
            )}
          </>
        )}

        <div className="catalog-note">
          <Recycle size={19} />
          Los productos se consultan desde el servidor de Fashion Style.
        </div>
      </section>
    );
  }

  function Donations() {
    return (
      <section className="page-section">
        <PageHeading
          eyebrow="COMPARTIR TAMBIÉN ES TRANSFORMAR"
          title={<>Dona con <em>propósito.</em></>}
          description="Lo que ya no necesitas puede ser una oportunidad para alguien más. Cuéntanos sobre las prendas que quieres compartir."
        />

        <div className="donation-layout">
          <div className="donation-aside">
            <div className="donation-aside-icon">
              <HandHeart size={38} />
            </div>

            <h2>
              Una prenda.<br />
              <em>Una nueva historia.</em>
            </h2>

            <p>
              Antes de donar, asegúrate de que las prendas estén limpias,
              en buen estado y listas para continuar su camino.
            </p>

            <ul>
              <li>Prendas limpias</li>
              <li>Sin daños importantes</li>
              <li>Accesorios en buen estado</li>
            </ul>
          </div>

          <form className="form-card" onSubmit={submitDonation}>
            <h3>Registro de intención de donación</h3>

            {donationError && (
              <p className="form-error" role="alert">
                {donationError}
              </p>
            )}

            <label>
              Nombre completo
              <input required name="name" placeholder="Tu nombre" />
            </label>

            <label>
              Correo electrónico
              <input
                required
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
              />
            </label>

            <label>
              Tipo de prendas
              <select required name="type" defaultValue="">
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                <option>Camisas y blusas</option>
                <option>Pantalones</option>
                <option>Vestidos</option>
                <option>Chaquetas</option>
                <option>Accesorios</option>
                <option>Varias categorías</option>
              </select>
            </label>

            <label>
              Cantidad aproximada
              <input
                required
                type="number"
                min="1"
                name="quantity"
                placeholder="Número de prendas"
              />
            </label>

            <label>
              Cuéntanos más
              <textarea
                name="details"
                rows="3"
                placeholder="Estado de las prendas u observaciones..."
              />
            </label>

            <button
              className="btn btn-dark form-submit"
              type="submit"
              disabled={donationLoading}
            >
              {donationLoading ? "Enviando..." : "Enviar intención"}
              <ArrowRight size={16} />
            </button>

            {donationSent && (
              <div className="form-success" role="status">
                ¡Gracias! Tu intención de donación fue recibida correctamente
                por el servidor de Fashion Style.
              </div>
            )}
          </form>
        </div>
      </section>
    );
  }

  function Sustainability() {
    const tips = [
      [
        "01",
        "Cuida lo que tienes",
        "Sigue las etiquetas de cuidado, lava solo cuando sea necesario y deja secar adecuadamente."
      ],
      [
        "02",
        "Repara y transforma",
        "Un botón, un dobladillo o un pequeño arreglo pueden extender la vida de una prenda."
      ],
      [
        "03",
        "Intercambia y comparte",
        "Organiza intercambios con familiares o amigos y encuentra nuevas prendas sin comprar."
      ],
      [
        "04",
        "Compra con intención",
        "Antes de adquirir algo, piensa en su utilidad, calidad y cuánto tiempo lo usarás."
      ]
    ];

    return (
      <section className="page-section sustainability-page">
        <PageHeading
          eyebrow="UN ARMARIO MÁS CONSCIENTE"
          title={<>El cambio empieza <em>contigo.</em></>}
          description="No se trata de hacerlo perfecto. Se trata de elegir pequeños hábitos que puedan marcar la diferencia."
        />

        <div className="sustain-feature">
          <div className="sustain-visual">
            <Leaf size={80} strokeWidth={0.8} />
            <span>CARE · REPAIR · REPEAT</span>
          </div>

          <div className="sustain-copy">
            <span className="eyebrow">UNA PRENDA PUEDE DURAR MÁS</span>
            <h2>El mejor cambio es el que podemos mantener.</h2>
            <p>
              La moda sostenible también está en las decisiones cotidianas:
              cuidar, reparar, reutilizar y compartir.
            </p>
          </div>
        </div>

        <div className="tip-grid">
          {tips.map(([number, title, description]) => (
            <article className="tip-card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>

        <div className="sustain-bottom">
          <Recycle size={25} />
          <div>
            <strong>¿Tienes ropa que ya no utilizas?</strong>
            <p>Puede ser el inicio de una nueva historia.</p>
          </div>

          <button
            className="btn btn-dark"
            onClick={() => navigate("donaciones")}
          >
            Conoce las donaciones <ArrowRight size={15} />
          </button>
        </div>
      </section>
    );
  }

  function Campaigns() {
    return (
      <section className="page-section campaigns-page">
        <PageHeading
          eyebrow="JUNTOS PODEMOS HACER MÁS"
          title={
            <>
              Pequeñas acciones,<br />
              <em>grandes historias.</em>
            </>
          }
          description="Fashion Style busca promover una relación más consciente con la ropa a través de iniciativas para compartir y reutilizar."
        />

        <div className="campaign-feature">
          <div className="campaign-art">
            <span>FASHION<br />STYLE</span>
            <Heart size={75} strokeWidth={0.8} />
            <span>SHARE THE CHANGE · 2026</span>
          </div>

          <div className="campaign-info">
            <span className="eyebrow">INICIATIVA DESTACADA</span>
            <h2>
              Un armario.<br />
              Muchas posibilidades.
            </h2>
            <p>
              Invitamos a nuestra comunidad a revisar sus prendas, separar
              aquellas que están en buen estado y descubrir nuevas maneras
              de compartirlas.
            </p>

            <button
              className="btn btn-dark"
              onClick={() => navigate("donaciones")}
            >
              Participar <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="campaign-values">
          <div>
            <Sprout />
            <h3>Consciencia</h3>
            <p>Decisiones informadas sobre lo que usamos.</p>
          </div>

          <div>
            <Heart />
            <h3>Comunidad</h3>
            <p>Compartir recursos y crear nuevas oportunidades.</p>
          </div>

          <div>
            <Recycle />
            <h3>Circularidad</h3>
            <p>Dar valor a lo que ya existe.</p>
          </div>
        </div>
      </section>
    );
  }

  function Assistant() {
    return (
      <section className="page-section assistant-page">
        <PageHeading
          eyebrow="IDEAS PARA UNA MODA CONSCIENTE"
          title={<>Hablemos de <em>nuevas ideas.</em></>}
          description="Pregúntanos sobre reutilización, cuidado de prendas, donaciones y sostenibilidad."
        />

        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-avatar">
              <Sparkles />
            </div>

            <div>
              <strong>Fashion Assistant</strong>
              <span>Guía de moda consciente · Demo</span>
            </div>

            <span className="chat-online" />
          </div>

          <div className="chat-messages">
            {chatMessages.map((message, index) => (
              <div
                className={`chat-message ${message.role}`}
                key={index}
              >
                <div className="message-icon">
                  {message.role === "bot" ? <Leaf size={15} /> : null}
                </div>

                <div className="message-bubble">
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <form className="chat-form" onSubmit={sendChat}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              aria-label="Escribe tu pregunta"
            />

            <button
              className="btn btn-dark"
              type="submit"
              aria-label="Enviar"
            >
              <Send size={17} />
            </button>
          </form>

          <div className="chat-disclaimer">
            Asistente demostrativo. Las respuestas se generan mediante
            reglas locales, no por un modelo de IA conectado.
          </div>
        </div>

        <div className="assistant-topics">
          <button onClick={() => setChatInput("¿Cómo puedo donar ropa?")}>
            ¿Cómo dono ropa?
          </button>

          <button onClick={() => setChatInput("¿Cómo cuido mis prendas?")}>
            Cuidado de prendas
          </button>

          <button onClick={() => setChatInput("¿Qué es la moda circular?")}>
            Moda circular
          </button>
        </div>
      </section>
    );
  }

  function Contact() {
    return (
      <section className="page-section contact-page">
        <PageHeading
          eyebrow="QUEREMOS ESCUCHARTE"
          title={<>Conversemos. <em>Tu voz importa.</em></>}
          description="¿Tienes una idea, una consulta o quieres participar? Envíanos tu mensaje."
        />

        <div className="contact-layout">
          <div className="contact-aside">
            <MessageCircle size={38} />
            <h2>Las mejores ideas nacen cuando las compartimos.</h2>
            <p>
              Escríbenos y cuéntanos cómo te gustaría ser parte de Fashion Style.
            </p>

            <div className="contact-detail">
              <Mail size={17} /> Formulario de contacto
            </div>

            <div className="contact-detail">
              <Leaf size={17} /> Moda con propósito
            </div>
          </div>

          <form className="form-card" onSubmit={submitContact}>
            <h3>Envíanos un mensaje</h3>

            {contactError && (
              <p className="form-error" role="alert">
                {contactError}
              </p>
            )}

            <label>
              Nombre
              <input required name="name" placeholder="Tu nombre" />
            </label>

            <label>
              Correo electrónico
              <input
                required
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
              />
            </label>

            <label>
              Asunto
              <input
                required
                name="subject"
                placeholder="¿Sobre qué quieres escribirnos?"
              />
            </label>

            <label>
              Mensaje
              <textarea
                required
                name="message"
                rows="5"
                placeholder="Escribe tu mensaje aquí..."
              />
            </label>

            <button
              className="btn btn-dark form-submit"
              type="submit"
              disabled={contactLoading}
            >
              {contactLoading ? "Enviando..." : "Enviar mensaje"}
              <Send size={16} />
            </button>

            {contactSent && (
              <div className="form-success" role="status">
                ¡Gracias por escribirnos! Tu mensaje fue recibido correctamente
                por el servidor de Fashion Style.
              </div>
            )}
          </form>
        </div>
      </section>
    );
  }

  return (
    <div className="site-shell">
      <div className="announcement">
        <span>MODA CONSCIENTE, CAMBIOS REALES</span>
        <span>Una prenda puede tener muchas vidas. ✳</span>
      </div>

      <header className="site-header">
        <button
          className="brand"
          onClick={() => navigate("inicio")}
        >
          <span className="brand-mark">
            <Leaf size={22} />
          </span>

          <span>
            <strong>fashion style</strong>
            <small>WEAR THE CHANGE</small>
          </span>
        </button>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={`navigation ${menuOpen ? "navigation-open" : ""}`}>
          {navItems.map(item => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={page === item.id ? "nav-active" : ""}
                onClick={() => navigate(item.id)}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main>
        {page === "inicio" && <Home />}
        {page === "catalogo" && <Catalog />}
        {page === "donaciones" && <Donations />}
        {page === "sostenibilidad" && <Sustainability />}
        {page === "campanas" && <Campaigns />}
        {page === "asistente" && <Assistant />}
        {page === "contacto" && <Contact />}
      </main>

      <footer className="site-footer">
        <button
          className="brand footer-brand"
          onClick={() => navigate("inicio")}
        >
          <span className="brand-mark">
            <Leaf size={21} />
          </span>

          <span>
            <strong>fashion style</strong>
            <small>WEAR THE CHANGE</small>
          </span>
        </button>

        <p>
          Moda consciente para un futuro que nos incluya a todos.
        </p>

        <div className="footer-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <span className="footer-copy">
          © {new Date().getFullYear()} Fashion Style · Wear the change
        </span>
      </footer>
    </div>
  );
}

export default App;
