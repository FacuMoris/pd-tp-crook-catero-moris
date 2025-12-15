import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import * as adminEstadoEquipoController from "../controllers/adminEstadoEquipoController.js";

const router = Router();

router.get(
  "/admin/estados-equipo",
  requireAuth,
  requireAdmin,
  adminEstadoEquipoController.list
);
router.get(
  "/admin/estados-equipo/:id",
  requireAuth,
  requireAdmin,
  adminEstadoEquipoController.get
);
router.post(
  "/admin/estados-equipo",
  requireAuth,
  requireAdmin,
  adminEstadoEquipoController.create
);
router.put(
  "/admin/estados-equipo/:id",
  requireAuth,
  requireAdmin,
  adminEstadoEquipoController.update
);
router.delete(
  "/admin/estados-equipo/:id",
  requireAuth,
  requireAdmin,
  adminEstadoEquipoController.remove
);

export default router;
