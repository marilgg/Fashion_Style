import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "node:crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CONFIGURACIÓN DE CORS
app.use(cors({
  origin: [
    "https://marilgg.github.io",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// CONEXIÓN CON SUPABASE
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan las variables de Supabase.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// CONFIGURACIÓN ADMINISTRATIVA
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET;

// COMPARACIÓN SEGURA
function compararSeguro(valor1, valor2) {
  const a = Buffer.from(String(valor1));
  const b = Buffer.from(String(valor2));

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

// CREAR TOKEN
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

// VERIFICAR TOKEN
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

// AUTENTICACIÓN ADMINISTRATIVA
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

// VALIDAR DATOS DE PRODUCTO
function validarProducto(datos) {
  const { nombre, categoria, precio, stock } = datos;

  const precioNumero = Number(precio);
  const stockNumero = Number(stock);

  if (
    typeof nombre !== "string" ||
    !nombre.trim() ||
    typeof categoria !== "string" ||
    !categoria.trim() ||
    precio === "" ||
    precio === null ||
    !Number.isFinite(precioNumero) ||
    precioNumero < 0 ||
    stock === "" ||
    stock === null ||
    !Number.isInteger(stockNumero) ||
    stockNumero < 0
  ) {
    return null;
  }

  return {
    nombre: nombre.trim(),
    categoria: categoria.trim(),
    precio: precioNumero,
    stock: stockNumero
  };
}

// RUTA PRINCIPAL
app.get("/", (req, res) => {
  res.json({
    mensaje: "Fashion Style API funcionando correctamente",
    estado: "online"
  });
});

// COMPROBAR CONEXIÓN
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
      codigo: error.code
    });
  }

  res.json({
    status: "ok",
    message: "Backend conectado a Supabase"
  });
});

// CONSULTAR TODOS LOS PRODUCTOS
app.get("/api/productos", async (req, res) => {
  const { data, error, count } = await supabase
    .from("productos")
    .select("*", { count: "exact" })
    .order("id", { ascending: true });

  if (error) {
    console.error("Error consultando productos:", error);

    return res.status(500).json({
      error: "No se pudieron consultar los productos"
    });
  }

  res.json({
    total: count,
    productos: data
  });
});

// CONSULTAR PRODUCTO POR ID
app.get("/api/productos/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "ID de producto no válido"
    });
  }

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error consultando producto:", error);

    return res.status(500).json({
      error: "Error al consultar el producto"
    });
  }

  if (!data) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  res.json(data);
});

// GUARDAR DONACIONES
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
      error: "No se pudo guardar la donación"
    });
  }

  res.status(201).json({
    mensaje: "Donación guardada correctamente",
    donacion: data
  });
});

// GUARDAR CONTACTOS
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
      error: "No se pudo guardar el mensaje"
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

// INICIAR SESIÓN
app.post("/api/admin/login", (req, res) => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_TOKEN_SECRET) {
    return res.status(503).json({
      error: "La administración no está configurada"
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

// CONSULTAR DONACIONES
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

// CONSULTAR CONTACTOS
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

// ================================
// CRUD ADMINISTRATIVO DE PRODUCTOS
// ================================

// CREAR PRODUCTO
app.post(
  "/api/admin/productos",
  autenticarAdmin,
  async (req, res) => {
    const producto = validarProducto(req.body);

    if (!producto) {
      return res.status(400).json({
        error: "Verifica nombre, categoría, precio y stock"
      });
    }

    const { data, error } = await supabase
      .from("productos")
      .insert([producto])
      .select()
      .single();

    if (error) {
      console.error("Error creando producto:", error);

      return res.status(500).json({
        error: "No se pudo crear el producto"
      });
    }

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto: data
    });
  }
);

// EDITAR PRODUCTO
app.put(
  "/api/admin/productos/:id",
  autenticarAdmin,
  async (req, res) => {
    const id = Number(req.params.id);
    const producto = validarProducto(req.body);

    if (!Number.isInteger(id) || id <= 0 || !producto) {
      return res.status(400).json({
        error: "ID o datos del producto no válidos"
      });
    }

    const { data, error } = await supabase
      .from("productos")
      .update(producto)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error editando producto:", error);

      return res.status(500).json({
        error: "No se pudo actualizar el producto"
      });
    }

    if (!data) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    res.json({
      mensaje: "Producto actualizado correctamente",
      producto: data
    });
  }
);

// ELIMINAR PRODUCTO
app.delete(
  "/api/admin/productos/:id",
  autenticarAdmin,
  async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "ID de producto no válido"
      });
    }

    const { data, error } = await supabase
      .from("productos")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error eliminando producto:", error);

      return res.status(500).json({
        error: "No se pudo eliminar el producto"
      });
    }

    if (!data) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    res.json({
      mensaje: "Producto eliminado correctamente",
      producto: data
    });
  }
);

// RUTAS INEXISTENTES
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`Fashion Style API activa en el puerto ${PORT}`);
});
