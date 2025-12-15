import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import * as adminEquipoController from "../controllers/adminEquipoController.js";

const router = Router();

router.get(
  "/admin/equipos",
  requireAuth,
  requireAdmin,
  adminEquipoController.list
);
router.get(
  "/admin/equipos/:id",
  requireAuth,
  requireAdmin,
  adminEquipoController.get
);
router.put(
  "/admin/equipos/:id/estado",
  requireAuth,
  requireAdmin,
  adminEquipoController.updateEstado
);
router.delete(
  "/admin/equipos/:id",
  requireAuth,
  requireAdmin,
  adminEquipoController.remove
);

export default router;
