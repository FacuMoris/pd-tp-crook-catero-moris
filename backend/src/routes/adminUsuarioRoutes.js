import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import * as adminUsuarioController from "../controllers/adminUsuarioController.js";

const router = Router();

router.get(
  "/admin/usuarios",
  requireAuth,
  requireAdmin,
  adminUsuarioController.list
);
router.get(
  "/admin/usuarios/:id",
  requireAuth,
  requireAdmin,
  adminUsuarioController.get
);
router.put(
  "/admin/usuarios/:id",
  requireAuth,
  requireAdmin,
  adminUsuarioController.update
);
router.delete(
  "/admin/usuarios/:id",
  requireAuth,
  requireAdmin,
  adminUsuarioController.remove
);

export default router;
