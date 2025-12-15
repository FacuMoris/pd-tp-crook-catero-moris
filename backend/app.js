import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import adminRolRoutes from "./src/routes/adminRolRoutes.js";
import adminRangoRoutes from "./src/routes/adminRangoRoutes.js";
import adminEstadoEquipoRoutes from "./src/routes/adminEstadoEquipoRoutes.js";
import equipoRoutes from "./src/routes/equipoRoutes.js";
import jugadorRoutes from "./src/routes/jugadorRoutes.js";
import adminEquipoRoutes from "./src/routes/adminEquipoRoutes.js";
import adminUsuarioRoutes from "./src/routes/adminUsuarioRoutes.js";
import adminJugadorRoutes from "./src/routes/adminJugadorRoutes.js";

dotenv.config();

const { urlencoded, json } = bodyParser;

const app = express();
const port = process.env.PORT || 8888;

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(usuarioRoutes);
app.use(adminRolRoutes);
app.use(adminRangoRoutes);
app.use(adminEstadoEquipoRoutes);
app.use(equipoRoutes);
app.use(jugadorRoutes);
app.use(adminEquipoRoutes);
app.use(adminUsuarioRoutes);
app.use(adminJugadorRoutes);

// CORS mínimo (manual)
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.CORS_ORIGIN || "http://localhost:5173"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint no encontrado" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Algo salió mal" });
});

app.listen(port, () => {
  console.log("Servidor iniciado en http://localhost:" + port);
});
