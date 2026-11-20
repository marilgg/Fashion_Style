import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "node:crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors({
  origin: [
    "https://marilgg.github.io",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Conexión con Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan las variables de Supabase.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Configuración de administración
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET;

// Comparación segura de valores
function compararSeguro(valor1, valor2) {
  const a = Buffer.from(String(valor1));
  const b = Buffer.from(String(valor2));

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

// Crear token firmado
function crearToken(email) {
  const payload = Buffer.from(JSON.stringify({
    email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8
  })).toString("base64url");

  const firma = createHmac("sha256", ADMIN_TOKEN_SECRET)
    .update(payload)
    .digest("base64url");

  return `${payload}.${firma}`;
}

// Verificar token
function verificarToken(token) {
  try {
    const partes = token.split(".");

    if (partes.length !== 2) {
      return null;
    }

    const [payload, firma] = partes;

    const firmaEsperada = createHmac("sha256", ADMIN_TOKEN_SECRET)
      .update(payload)
      .digest("base64url");

    if (!compararSeguro(firma, firmaEsperada)) {
      return null;
    }

    const datos = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    if (
      datos.email !== ADMIN_EMAIL ||
      datos.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return datos;
  } catch {
    return null;
  }
}

// Proteger las rutas administrativas
function autenticarAdmin(req, res, next) {
  const autorizacion = req.headers.authorization;

  if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Debes iniciar sesión como administrador"
    });
  }

  const token = autorizacion.slice(7);
  const usuario = verificarToken(token);

  if (!usuario) {
    return res.status(401).json({
      error: "Sesión inválida o vencida"
    });
  }

  req.admin = usuario;
  next();
}

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    mensaje: "Fashion Style API funcionando correctamente",
    estado: "online"
  });
});

// Comprobar conexión con Supabase
app.get("/api/health", async (req, res) => {
  const { error } = await supabase
    .from("productos")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Error de conexión:", error);

    return res.status(500).json({
      status: "error",
      message: "No se pudo conectar con Supabase",
      detalles: error.message,
      codigo: error.code
    });
  }

  res.json({
    status: "ok",
    message: "Backend conectado a Supabase"
  });
});

// Listar productos
app.get("/api/productos", async (req, res) => {
  const { data, error, count } = await supabase
    .from("productos")
    .select("*", { count: "exact" })
    .order("id", { ascending: true });

  if (error) {
    console.error("Error de Supabase:", error);

    return res.status(500).json({
      error: error.message,
      codigo: error.code,
      detalles: error.details
    });
  }

  res.json({
    total: count,
    productos: data
  });
});

// Consultar un producto por ID
app.get("/api/productos/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();

  if (error) {
    console.error("Error consultando producto:", error);

    return res.status(500).json({
      error: "Error al consultar el producto",
      detalles: error.message
    });
  }

  if (!data) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  res.json(data);
});

// Guardar donaciones
app.post("/api/donaciones", async (req, res) => {
  const { nombre, correo, tipo, cantidad } = req.body;

  if (
    !nombre ||
    !correo ||
    !tipo ||
    !Number.isInteger(Number(cantidad)) ||
    Number(cantidad) <= 0
  ) {
    return res.status(400).json({
      error: "Completa correctamente todos los campos"
    });
  }

  const { data, error } = await supabase
    .from("donaciones")
    .insert([{
      nombre,
      correo,
      tipo,
      cantidad: Number(cantidad)
    }])
    .select()
    .single();

  if (error) {
    console.error("Error guardando donación:", error);

    return res.status(500).json({
      error: "No se pudo guardar la donación",
      detalles: error.message
    });
  }

  res.status(201).json({
    mensaje: "Donación guardada correctamente",
    donacion: data
  });
});

// Guardar mensajes de contacto
app.post("/api/contacto", async (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;

  if (!nombre || !correo || !asunto || !mensaje) {
    return res.status(400).json({
      error: "Completa todos los campos del formulario"
    });
  }

  const { data, error } = await supabase
    .from("contactos")
    .insert([{
      nombre,
      correo,
      asunto,
      mensaje
    }])
    .select()
    .single();

  if (error) {
    console.error("Error guardando contacto:", error);

    return res.status(500).json({
      error: "No se pudo guardar el mensaje",
      detalles: error.message
    });
  }

  res.status(201).json({
    mensaje: "Mensaje guardado correctamente",
    contacto: data
  });
});

// ================================
// ADMINISTRACIÓN
// ================================

// Iniciar sesión administrativa
app.post("/api/admin/login", (req, res) => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_TOKEN_SECRET) {
    return res.status(503).json({
      error: "La administración todavía no está configurada en el servidor"
    });
  }

  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !compararSeguro(email, ADMIN_EMAIL) ||
    !compararSeguro(password, ADMIN_PASSWORD)
  ) {
    return res.status(401).json({
      error: "Correo o contraseña incorrectos"
    });
  }

  const token = crearToken(ADMIN_EMAIL);

  res.json({
    mensaje: "Sesión iniciada correctamente",
    token
  });
});

// Consultar donaciones (solo administrador)
app.get(
  "/api/admin/donaciones",
  autenticarAdmin,
  async (req, res) => {
    const { data, error } = await supabase
      .from("donaciones")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error consultando donaciones:", error);

      return res.status(500).json({
        error: "No se pudieron consultar las donaciones"
      });
    }

    res.json({
      total: data.length,
      donaciones: data
    });
  }
);

// Consultar contactos (solo administrador)
app.get(
  "/api/admin/contactos",
  autenticarAdmin,
  async (req, res) => {
    const { data, error } = await supabase
      .from("contactos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error consultando contactos:", error);

      return res.status(500).json({
        error: "No se pudieron consultar los mensajes"
      });
    }

    res.json({
      total: data.length,
      contactos: data
    });
  }
);

// Rutas inexistentes
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Fashion Style API activa en el puerto ${PORT}`);
});
