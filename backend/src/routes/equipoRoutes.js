const express = require("express");

const router = express.Router();

const equipoController = require("../controllers/equipoController");

router.get("/equipos", equipoController.index);

router.post("/equipos", equipoController.store);

router.get("/equipos/:ID", equipoController.show);

router.put("/equipos/:ID", equipoController.update);

router.get("/equipos-activos", equipoController.activeTeams);

router.get("/equipos/historial/:ID", equipoController.history);

module.exports = router;
