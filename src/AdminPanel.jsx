import { useEffect, useState } from "react";
import {
  iniciarSesionAdmin,
  listarDonacionesAdmin,
  listarContactosAdmin
} from "./api.js";

const estilos = {
  pagina: {
    minHeight: "100vh",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #f4efff, #eef8f1)",
    color: "#26352d",
    fontFamily: "Arial, sans-serif"
  },
  contenedor: {
    maxWidth: "1100px",
    margin: "0 auto"
  },
  tarjeta: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0 8px 30px rgba(40, 60, 45, 0.08)",
    marginBottom: "22px"
  },
  boton: {
    border: "none",
    borderRadius: "10px",
    padding: "12px 18px",
    background: "#668b70",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer"
  },
  input: {
    width: "100%",
    padding: "13px",
    border: "1px solid #dce5dd",
    borderRadius: "9px",
    marginTop: "7px",
    marginBottom: "17px",
    boxSizing: "border-box",
    fontSize: "15px"
  },
  tablaContenedor: {
    overflowX: "auto"
  },
  tabla: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "650px"
  },
  celda: {
    textAlign: "left",
    padding: "13px",
    borderBottom: "1px solid #edf0ed",
    fontSize: "14px",
    verticalAlign: "top"
  }
};

function fechaLegible(fecha) {
  if (!fecha) return "Sin fecha";

  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) return "Sin fecha";

  return valor.toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

export default function AdminPanel({ onBack }) {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("fashion_admin_token") || ""
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [donaciones, setDonaciones] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function cargarRegistros(sesion = token) {
    setCargando(true);
    setError("");

    try {
      const [datosDonaciones, datosContactos] = await Promise.all([
        listarDonacionesAdmin(sesion),
        listarContactosAdmin(sesion)
      ]);

      setDonaciones(datosDonaciones.donaciones || []);
      setContactos(datosContactos.contactos || []);
    } catch (err) {
      setError(err.message);

      if (
        err.message.toLowerCase().includes("sesión") ||
        err.message.toLowerCase().includes("administrador")
      ) {
        cerrarSesion();
      }
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    if (token) {
      cargarRegistros(token);
    }
  }, []);

  async function manejarInicioSesion(evento) {
    evento.preventDefault();
    setError("");
    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await iniciarSesionAdmin(email, password);

      sessionStorage.setItem("fashion_admin_token", respuesta.token);
      setToken(respuesta.token);
      setPassword("");
      setMensaje("Sesión iniciada correctamente.");

      await cargarRegistros(respuesta.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  function cerrarSesion() {
    sessionStorage.removeItem("fashion_admin_token");
    setToken("");
    setDonaciones([]);
    setContactos([]);
    setPassword("");
    setMensaje("");
  }

  return (
    <main style={estilos.pagina}>
      <div style={estilos.contenedor}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "30px"
        }}>
          <div>
            <p style={{
              color: "#668b70",
              fontWeight: "bold",
              letterSpacing: "2px",
              fontSize: "12px"
            }}>
              FASHION STYLE
            </p>
            <h1 style={{ margin: "5px 0", fontSize: "30px" }}>
              Panel administrativo
            </h1>
            <p style={{ color: "#718078", margin: 0 }}>
              Gestión de donaciones y mensajes recibidos
            </p>
          </div>

          {onBack && (
            <button style={estilos.boton} onClick={onBack}>
              Volver a la página
            </button>
          )}
        </header>

        {!token ? (
          <section style={{
            ...estilos.tarjeta,
            maxWidth: "430px",
            margin: "35px auto"
          }}>
            <h2>Acceso administrativo</h2>
            <p style={{ color: "#718078" }}>
              Ingresa tus credenciales para consultar los registros.
            </p>

            <form onSubmit={manejarInicioSesion}>
              <label htmlFor="admin-email">Correo administrativo</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={estilos.input}
                placeholder="Correo de administrador"
              />

              <label htmlFor="admin-password">Contraseña</label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={estilos.input}
                placeholder="Tu contraseña"
              />

              <button
                type="submit"
                disabled={cargando}
                style={{
                  ...estilos.boton,
                  width: "100%",
                  opacity: cargando ? 0.7 : 1
                }}
              >
                {cargando ? "Verificando..." : "Iniciar sesión"}
              </button>
            </form>

            {error && (
              <p role="alert" style={{ color: "#bd4141", marginTop: "15px" }}>
                {error}
              </p>
            )}
          </section>
        ) : (
          <>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "22px"
            }}>
              <p style={{ color: "#668b70" }}>
                Sesión administrativa activa
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={estilos.boton}
                  onClick={() => cargarRegistros()}
                  disabled={cargando}
                >
                  {cargando ? "Actualizando..." : "Actualizar"}
                </button>

                <button
                  style={{
                    ...estilos.boton,
                    background: "#8b7777"
                  }}
                  onClick={cerrarSesion}
                >
                  Cerrar sesión
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" style={{ color: "#bd4141" }}>
                {error}
              </p>
            )}

            {mensaje && (
              <p style={{ color: "#668b70" }}>{mensaje}</p>
            )}

            <section style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "18px",
              marginBottom: "25px"
            }}>
              <div style={estilos.tarjeta}>
                <p style={{ color: "#718078" }}>Donaciones recibidas</p>
                <h2 style={{ fontSize: "35px", margin: 0 }}>
                  {donaciones.length}
                </h2>
              </div>

              <div style={estilos.tarjeta}>
                <p style={{ color: "#718078" }}>Mensajes recibidos</p>
                <h2 style={{ fontSize: "35px", margin: 0 }}>
                  {contactos.length}
                </h2>
              </div>
            </section>

            <section style={estilos.tarjeta}>
              <h2>Donaciones recibidas</h2>

              {donaciones.length === 0 ? (
                <p style={{ color: "#718078" }}>
                  Todavía no hay donaciones registradas.
                </p>
              ) : (
                <div style={estilos.tablaContenedor}>
                  <table style={estilos.tabla}>
                    <thead>
                      <tr>
                        {["Nombre", "Correo", "Tipo", "Cantidad", "Fecha"].map(
                          (titulo) => (
                            <th key={titulo} style={estilos.celda}>
                              {titulo}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {donaciones.map((donacion) => (
                        <tr key={donacion.id}>
                          <td style={estilos.celda}>{donacion.nombre}</td>
                          <td style={estilos.celda}>{donacion.correo}</td>
                          <td style={estilos.celda}>{donacion.tipo}</td>
                          <td style={estilos.celda}>{donacion.cantidad}</td>
                          <td style={estilos.celda}>
                            {fechaLegible(donacion.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section style={estilos.tarjeta}>
              <h2>Mensajes de contacto</h2>

              {contactos.length === 0 ? (
                <p style={{ color: "#718078" }}>
                  Todavía no hay mensajes registrados.
                </p>
              ) : (
                <div style={estilos.tablaContenedor}>
                  <table style={estilos.tabla}>
                    <thead>
                      <tr>
                        {["Nombre", "Correo", "Asunto", "Mensaje", "Fecha"].map(
                          (titulo) => (
                            <th key={titulo} style={estilos.celda}>
                              {titulo}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {contactos.map((contacto) => (
                        <tr key={contacto.id}>
                          <td style={estilos.celda}>{contacto.nombre}</td>
                          <td style={estilos.celda}>{contacto.correo}</td>
                          <td style={estilos.celda}>{contacto.asunto}</td>
                          <td style={{
                            ...estilos.celda,
                            minWidth: "200px",
                            whiteSpace: "pre-wrap"
                          }}>
                            {contacto.mensaje}
                          </td>
                          <td style={estilos.celda}>
                            {fechaLegible(contacto.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
