import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as equipoController from "../controllers/equipoController.js";

const router = Router();

router.get("/equipos", equipoController.listAll);
router.get("/me/equipos", requireAuth, equipoController.listMine);
router.get("/me/equipos/:id", requireAuth, equipoController.getById);
router.get("/me/equipo-actual", requireAuth, equipoController.getEquipoActual);
router.put("/me/equipos/:id", requireAuth, equipoController.updateMine);
router.post("/me/equipos", requireAuth, equipoController.createMine);
router.delete("/me/equipos/:id", requireAuth, equipoController.deleteMine);
router.post("/equipos/:id/unirse", requireAuth, equipoController.unirse);
router.post("/equipos/:id/salir", requireAuth, equipoController.salir);
router.get("/equipos/:id/mensajes", requireAuth, equipoController.listMensajes);
router.post(
  "/equipos/:id/mensajes",
  requireAuth,
  equipoController.enviarMensaje
);

// miembros
router.get(
  "/me/equipos/:id/miembros",
  requireAuth,
  equipoController.listMiembros
);
router.post(
  "/me/equipos/:id/miembros",
  requireAuth,
  equipoController.addMiembro
);
router.delete(
  "/me/equipos/:id/miembros/:id_jugador",
  requireAuth,
  equipoController.removeMiembro
);

export default router;
