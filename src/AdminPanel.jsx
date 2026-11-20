import { useEffect, useState } from "react";

import {
  iniciarSesionAdmin,
  listarDonacionesAdmin,
  listarContactosAdmin,
  listarProductos,
  crearProductoAdmin,
  editarProductoAdmin,
  eliminarProductoAdmin
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

function precioLegible(precio) {
  return Number(precio || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  });
}

const formularioInicial = {
  nombre: "",
  categoria: "",
  precio: "",
  stock: ""
};

export default function AdminPanel({ onBack }) {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("fashion_admin_token") || ""
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [donaciones, setDonaciones] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [productos, setProductos] = useState([]);

  const [formulario, setFormulario] = useState(formularioInicial);
  const [productoEditando, setProductoEditando] = useState(null);

  const [cargando, setCargando] = useState(false);
  const [guardandoProducto, setGuardandoProducto] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  // CARGAR REGISTROS
  async function cargarRegistros(sesion = token) {
    if (!sesion) return;

    setCargando(true);
    setError("");

    try {
      const [
        datosDonaciones,
        datosContactos,
        datosProductos
      ] = await Promise.all([
        listarDonacionesAdmin(sesion),
        listarContactosAdmin(sesion),
        listarProductos()
      ]);

      setDonaciones(datosDonaciones.donaciones || []);
      setContactos(datosContactos.contactos || []);
      setProductos(datosProductos || []);
    } catch (err) {
      setError(err.message);

      if (
        err.message.toLowerCase().includes("sesión") ||
        err.message.toLowerCase().includes("administrador") ||
        err.message.toLowerCase().includes("token")
      ) {
        cerrarSesion();
      }
    } finally {
      setCargando(false);
    }
  }

  // RECUPERAR SESIÓN
  useEffect(() => {
    const sesionGuardada = sessionStorage.getItem(
      "fashion_admin_token"
    );

    if (sesionGuardada) {
      cargarRegistros(sesionGuardada);
    }
  }, []);

  // INICIAR SESIÓN
  async function manejarInicioSesion(evento) {
    evento.preventDefault();

    setError("");
    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await iniciarSesionAdmin(email, password);

      sessionStorage.setItem(
        "fashion_admin_token",
        respuesta.token
      );

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

  // CERRAR SESIÓN
  function cerrarSesion() {
    sessionStorage.removeItem("fashion_admin_token");

    setToken("");
    setDonaciones([]);
    setContactos([]);
    setProductos([]);
    setPassword("");
    setFormulario(formularioInicial);
    setProductoEditando(null);
    setMensaje("");
    setError("");
  }

  // ACTUALIZAR FORMULARIO
  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  // LIMPIAR FORMULARIO
  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setProductoEditando(null);
  }

  // GUARDAR O EDITAR PRODUCTO
  async function manejarGuardarProducto(evento) {
    evento.preventDefault();

    setError("");
    setMensaje("");

    if (
      !formulario.nombre.trim() ||
      !formulario.categoria.trim() ||
      formulario.precio === "" ||
      formulario.stock === ""
    ) {
      setError("Completa todos los campos del producto.");
      return;
    }

    const precio = Number(formulario.precio);
    const stock = Number(formulario.stock);

    if (!Number.isFinite(precio) || precio < 0) {
      setError("El precio debe ser un número válido y no negativo.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("El stock debe ser un número entero no negativo.");
      return;
    }

    const datos = {
      nombre: formulario.nombre.trim(),
      categoria: formulario.categoria.trim(),
      precio,
      stock
    };

    setGuardandoProducto(true);

    try {
      if (productoEditando) {
        await editarProductoAdmin(
          token,
          productoEditando,
          datos
        );

        setMensaje("Producto actualizado correctamente.");
      } else {
        await crearProductoAdmin(token, datos);

        setMensaje("Producto registrado correctamente.");
      }

      limpiarFormulario();
      await cargarRegistros(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardandoProducto(false);
    }
  }

  // PREPARAR EDICIÓN
  function prepararEdicion(producto) {
    setProductoEditando(producto.id);

    setFormulario({
      nombre: producto.nombre || "",
      categoria: producto.categoria || "",
      precio: String(producto.precio ?? ""),
      stock: String(producto.stock ?? "")
    });

    setMensaje("Editando producto: " + producto.nombre);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // ELIMINAR PRODUCTO
  async function manejarEliminarProducto(producto) {
    const confirmar = window.confirm(
      `¿Estás segura de que deseas eliminar "${producto.nombre}"?`
    );

    if (!confirmar) return;

    setError("");
    setMensaje("");

    try {
      await eliminarProductoAdmin(token, producto.id);

      if (productoEditando === producto.id) {
        limpiarFormulario();
      }

      setMensaje("Producto eliminado correctamente.");

      await cargarRegistros(token);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main style={estilos.pagina}>
      <div style={estilos.contenedor}>

        {/* ENCABEZADO */}
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
              Administración general de la plataforma
            </p>
          </div>

          {onBack && (
            <button
              style={estilos.boton}
              onClick={onBack}
            >
              Volver a la página
            </button>
          )}
        </header>

        {/* INICIO DE SESIÓN */}
        {!token ? (
          <section style={{
            ...estilos.tarjeta,
            maxWidth: "430px",
            margin: "35px auto"
          }}>
            <h2>Acceso administrativo</h2>

            <p style={{ color: "#718078" }}>
              Ingresa tus credenciales para administrar Fashion Style.
            </p>

            <form onSubmit={manejarInicioSesion}>
              <label htmlFor="admin-email">
                Correo administrativo
              </label>

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

              <label htmlFor="admin-password">
                Contraseña
              </label>

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
              <p role="alert" style={{
                color: "#bd4141",
                marginTop: "15px"
              }}>
                {error}
              </p>
            )}
          </section>
        ) : (
          <>
            {/* CONTROLES */}
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

              <div style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap"
              }}>
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
              <p
                role="alert"
                style={{
                  color: "#bd4141",
                  background: "#fff0f0",
                  padding: "12px",
                  borderRadius: "10px"
                }}
              >
                {error}
              </p>
            )}

            {mensaje && (
              <p style={{
                color: "#668b70",
                background: "#edf7ef",
                padding: "12px",
                borderRadius: "10px"
              }}>
                {mensaje}
              </p>
            )}

            {/* RESUMEN */}
            <section style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "18px",
              marginBottom: "25px"
            }}>
              {[
                {
                  titulo: "Productos registrados",
                  cantidad: productos.length
                },
                {
                  titulo: "Donaciones recibidas",
                  cantidad: donaciones.length
                },
                {
                  titulo: "Mensajes recibidos",
                  cantidad: contactos.length
                }
              ].map((dato) => (
                <div
                  key={dato.titulo}
                  style={estilos.tarjeta}
                >
                  <p style={{ color: "#718078" }}>
                    {dato.titulo}
                  </p>

                  <h2 style={{
                    fontSize: "35px",
                    margin: 0,
                    color: "#668b70"
                  }}>
                    {dato.cantidad}
                  </h2>
                </div>
              ))}
            </section>

            {/* FORMULARIO DE PRODUCTOS */}
            <section style={estilos.tarjeta}>
              <h2>
                {productoEditando
                  ? "Editar producto"
                  : "Registrar nuevo producto"}
              </h2>

              <p style={{ color: "#718078" }}>
                Completa los datos para administrar el inventario.
              </p>

              <form onSubmit={manejarGuardarProducto}>
                <label htmlFor="producto-nombre">
                  Nombre del producto
                </label>

                <input
                  id="producto-nombre"
                  name="nombre"
                  type="text"
                  required
                  maxLength={100}
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  style={estilos.input}
                  placeholder="Ej. Camisa reciclada"
                />

                <label htmlFor="producto-categoria">
                  Categoría
                </label>

                <input
                  id="producto-categoria"
                  name="categoria"
                  type="text"
                  required
                  maxLength={60}
                  value={formulario.categoria}
                  onChange={manejarCambio}
                  style={estilos.input}
                  placeholder="Ej. Ropa sostenible"
                />

                <label htmlFor="producto-precio">
                  Precio (COP)
                </label>

                <input
                  id="producto-precio"
                  name="precio"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={formulario.precio}
                  onChange={manejarCambio}
                  style={estilos.input}
                  placeholder="Ej. 45000"
                />

                <label htmlFor="producto-stock">
                  Cantidad disponible
                </label>

                <input
                  id="producto-stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={formulario.stock}
                  onChange={manejarCambio}
                  style={estilos.input}
                  placeholder="Ej. 20"
                />

                <div style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap"
                }}>
                  <button
                    type="submit"
                    disabled={guardandoProducto}
                    style={{
                      ...estilos.boton,
                      opacity: guardandoProducto ? 0.7 : 1
                    }}
                  >
                    {guardandoProducto
                      ? "Guardando..."
                      : productoEditando
                        ? "Guardar cambios"
                        : "Agregar producto"}
                  </button>

                  {productoEditando && (
                    <button
                      type="button"
                      onClick={limpiarFormulario}
                      style={{
                        ...estilos.boton,
                        background: "#8b7777"
                      }}
                    >
                      Cancelar edición
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* INVENTARIO */}
            <section style={estilos.tarjeta}>
              <h2>Inventario de productos</h2>

              <p style={{ color: "#718078" }}>
                Consulta, modifica o elimina los productos registrados.
              </p>

              {productos.length === 0 ? (
                <p style={{ color: "#718078" }}>
                  No hay productos registrados.
                </p>
              ) : (
                <div style={estilos.tablaContenedor}>
                  <table style={estilos.tabla}>
                    <thead>
                      <tr>
                        {[
                          "ID",
                          "Producto",
                          "Categoría",
                          "Precio",
                          "Stock",
                          "Acciones"
                        ].map((titulo) => (
                          <th
                            key={titulo}
                            style={estilos.celda}
                          >
                            {titulo}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {productos.map((producto) => (
                        <tr key={producto.id}>
                          <td style={estilos.celda}>
                            {producto.id}
                          </td>

                          <td style={estilos.celda}>
                            {producto.nombre}
                          </td>

                          <td style={estilos.celda}>
                            {producto.categoria}
                          </td>

                          <td style={estilos.celda}>
                            {precioLegible(producto.precio)}
                          </td>

                          <td style={estilos.celda}>
                            {producto.stock}
                          </td>

                          <td style={{
                            ...estilos.celda,
                            minWidth: "170px"
                          }}>
                            <div style={{
                              display: "flex",
                              gap: "7px",
                              flexWrap: "wrap"
                            }}>
                              <button
                                type="button"
                                onClick={() => prepararEdicion(producto)}
                                style={{
                                  ...estilos.boton,
                                  padding: "8px 11px",
                                  background: "#668b70"
                                }}
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => manejarEliminarProducto(producto)}
                                style={{
                                  ...estilos.boton,
                                  padding: "8px 11px",
                                  background: "#b75d5d"
                                }}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* DONACIONES */}
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
                        {[
                          "Nombre",
                          "Correo",
                          "Tipo",
                          "Cantidad",
                          "Fecha"
                        ].map((titulo) => (
                          <th
                            key={titulo}
                            style={estilos.celda}
                          >
                            {titulo}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {donaciones.map((donacion) => (
                        <tr key={donacion.id}>
                          <td style={estilos.celda}>
                            {donacion.nombre}
                          </td>

                          <td style={estilos.celda}>
                            {donacion.correo}
                          </td>

                          <td style={estilos.celda}>
                            {donacion.tipo}
                          </td>

                          <td style={estilos.celda}>
                            {donacion.cantidad}
                          </td>

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

            {/* MENSAJES */}
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
                        {[
                          "Nombre",
                          "Correo",
                          "Asunto",
                          "Mensaje",
                          "Fecha"
                        ].map((titulo) => (
                          <th
                            key={titulo}
                            style={estilos.celda}
                          >
                            {titulo}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {contactos.map((contacto) => (
                        <tr key={contacto.id}>
                          <td style={estilos.celda}>
                            {contacto.nombre}
                          </td>

                          <td style={estilos.celda}>
                            {contacto.correo}
                          </td>

                          <td style={estilos.celda}>
                            {contacto.asunto}
                          </td>

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
