import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as equipoController from "../controllers/equipoController.js";

const router = Router();

// ABM de mis equipos (donde soy líder)
router.get("/equipos", equipoController.listAll);
router.get("/me/equipos", requireAuth, equipoController.listMine);
router.get("/me/equipos/:id", requireAuth, equipoController.getById);
router.post("/me/equipos", requireAuth, equipoController.createMine);
router.put("/me/equipos/:id", requireAuth, equipoController.updateMine);
router.delete("/me/equipos/:id", requireAuth, equipoController.deleteMine);

// miembros (solo líder)
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
