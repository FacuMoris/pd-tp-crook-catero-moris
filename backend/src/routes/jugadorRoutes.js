import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as jugadorController from "../controllers/jugadorController.js";

const router = Router();

router.get("/me/jugador", requireAuth, jugadorController.getMe);
router.post("/me/jugador", requireAuth, jugadorController.createMe);
router.put("/me/jugador", requireAuth, jugadorController.updateMe);
router.delete("/me/jugador", requireAuth, jugadorController.deleteMe);

export default router;
