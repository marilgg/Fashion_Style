
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "/src/styles/global.css";
// Comprobación de la versión actual del proyecto

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
