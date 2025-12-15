import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import * as adminJugadorController from "../controllers/adminJugadorController.js";

const router = Router();

router.get(
  "/admin/jugadores",
  requireAuth,
  requireAdmin,
  adminJugadorController.list
);
router.get(
  "/admin/jugadores/:id",
  requireAuth,
  requireAdmin,
  adminJugadorController.get
);
router.put(
  "/admin/jugadores/:id",
  requireAuth,
  requireAdmin,
  adminJugadorController.update
);
router.delete(
  "/admin/jugadores/:id",
  requireAuth,
  requireAdmin,
  adminJugadorController.remove
);

export default router;
