import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "https://marilgg.github.io",
    "http://localhost:5173"
  ]
}));

app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan las variables de Supabase.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/", (req, res) => {
  res.json({
    mensaje: "Fashion Style API funcionando correctamente",
    estado: "online"
  });
});

app.get("/api/health", async (req, res) => {
  const { error } = await supabase
    .from("productos")
    .select("id")
    .limit(1);

  if (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudo conectar con Supabase"
    });
  }

  res.json({
    status: "ok",
    message: "Backend conectado a Supabase"
  });
});

app.get("/api/productos", async (req, res) => {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return res.status(500).json({
      error: "No se pudieron consultar los productos"
    });
  }

  res.json(data);
});

app.get("/api/productos/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: "Error al consultar el producto" });
  }

  if (!data) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(data);
});

app.post("/api/donaciones", async (req, res) => {
  const { nombre, correo, tipo, cantidad } = req.body;

  if (!nombre || !correo || !tipo || !Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
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
    return res.status(500).json({ error: "No se pudo guardar la donación" });
  }

  res.status(201).json({
    mensaje: "Donación guardada correctamente",
    donacion: data
  });
});

app.post("/api/contacto", async (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;

  if (!nombre || !correo || !asunto || !mensaje) {
    return res.status(400).json({
      error: "Completa todos los campos del formulario"
    });
  }

  const { data, error } = await supabase
    .from("contactos")
    .insert([{ nombre, correo, asunto, mensaje }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: "No se pudo guardar el mensaje" });
  }

  res.status(201).json({
    mensaje: "Mensaje guardado correctamente",
    contacto: data
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Fashion Style API activa en el puerto ${PORT}`);
});
