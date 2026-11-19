import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: [
    "https://marilgg.github.io",
    "http://localhost:5173"
  ]
}));

app.use(express.json());

// Inicio de la API
app.get("/", (req, res) => {
  res.json({
    mensaje: "Fashion Style API funcionando correctamente",
    estado: "online"
  });
});

// Comprobar estado del servidor
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend Fashion Style activo"
  });
});

// Productos de prueba
const productos = [
  {
    id: 1,
    nombre: "Blusa sostenible",
    categoria: "Blusas",
    precio: 45000,
    stock: 10
  },
  {
    id: 2,
    nombre: "Jean reutilizado",
    categoria: "Pantalones",
    precio: 65000,
    stock: 5
  },
  {
    id: 3,
    nombre: "Vestido ecológico",
    categoria: "Vestidos",
    precio: 80000,
    stock: 4
  }
];

// Consultar productos
app.get("/api/productos", (req, res) => {
  res.json(productos);
});

// Consultar un producto por ID
app.get("/api/productos/:id", (req, res) => {
  const producto = productos.find(
    p => p.id === Number(req.params.id)
  );

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  res.json(producto);
});

// Recibir donaciones (temporal, sin base de datos)
app.post("/api/donaciones", (req, res) => {
  const { nombre, correo, tipo, cantidad } = req.body;

  if (!nombre || !correo || !tipo || !cantidad) {
    return res.status(400).json({
      error: "Todos los campos obligatorios deben completarse"
    });
  }

  res.status(201).json({
    mensaje: "Donación recibida correctamente",
    donacion: { nombre, correo, tipo, cantidad }
  });
});

// Recibir mensajes de contacto (temporal, sin base de datos)
app.post("/api/contacto", (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;

  if (!nombre || !correo || !asunto || !mensaje) {
    return res.status(400).json({
      error: "Completa todos los campos del formulario"
    });
  }

  res.status(201).json({
    mensaje: "Mensaje recibido correctamente"
  });
});

// Ruta inexistente
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Fashion Style API activa en el puerto ${PORT}`);
});
