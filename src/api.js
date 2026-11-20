
const API_URL = "https://fashion-style-2sk2.onrender.com";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al comunicarse con el servidor");
  }

  return data;
}

// PRODUCTOS
export async function listarProductos() {
  const data = await request("/api/productos");
  return data.productos;
}

// DONACIONES
export function enviarDonacion(datos) {
  return request("/api/donaciones", {
    method: "POST",
    body: JSON.stringify(datos)
  });
}

// CONTACTO
export function enviarContacto(datos) {
  return request("/api/contacto", {
    method: "POST",
    body: JSON.stringify(datos)
  });
}

// SERVIDOR
export function comprobarServidor() {
  return request("/api/health");
}

// INICIAR SESIÓN ADMINISTRATIVA
export function iniciarSesionAdmin(email, password) {
  return request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

// CONSULTAR DONACIONES
export function listarDonacionesAdmin(token) {
  return request("/api/admin/donaciones", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

// CONSULTAR MENSAJES
export function listarContactosAdmin(token) {
  return request("/api/admin/contactos", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
