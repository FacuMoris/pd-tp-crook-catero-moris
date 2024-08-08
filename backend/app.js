const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 8888;

app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(require("./src/routes/equipoRoutes"));
app.use(require("./src/routes/jugadorRoutes"));
app.use(require("./src/routes/rangoRoutes"));
app.use(require("./src/routes/usuarioRoutes"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salio mal!");
});

app.listen(port, () => {
  console.log("Servidor iniciado en http://localhost:" + port);
});
