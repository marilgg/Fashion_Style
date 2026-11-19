const API_URL = "https://fashion-style-2sk2.onrender.com";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al comunicarse con el servidor");
  }

  return data;
}

export function listarProductos() {
  return request("/api/productos");
}

export function enviarDonacion(datos) {
  return request("/api/donaciones", {
    method: "POST",
    body: JSON.stringify(datos)
  });
}

export function enviarContacto(datos) {
  return request("/api/contacto", {
    method: "POST",
    body: JSON.stringify(datos)
  });
}

export function comprobarServidor() {
  return request("/api/health");
}
