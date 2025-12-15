import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import * as adminRolController from "../controllers/adminRolController.js";

const router = Router();

router.get("/admin/roles", requireAuth, requireAdmin, adminRolController.list);
router.get(
  "/admin/roles/:id",
  requireAuth,
  requireAdmin,
  adminRolController.get
);
router.post(
  "/admin/roles",
  requireAuth,
  requireAdmin,
  adminRolController.create
);
router.put(
  "/admin/roles/:id",
  requireAuth,
  requireAdmin,
  adminRolController.update
);
router.delete(
  "/admin/roles/:id",
  requireAuth,
  requireAdmin,
  adminRolController.remove
);

export default router;
