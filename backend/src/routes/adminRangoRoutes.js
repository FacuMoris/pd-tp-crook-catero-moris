import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import * as adminRangoController from "../controllers/adminRangoController.js";

const router = Router();

router.get(
  "/admin/rangos",
  requireAuth,
  requireAdmin,
  adminRangoController.list
);
router.get(
  "/admin/rangos/:id",
  requireAuth,
  requireAdmin,
  adminRangoController.get
);
router.post(
  "/admin/rangos",
  requireAuth,
  requireAdmin,
  adminRangoController.create
);
router.put(
  "/admin/rangos/:id",
  requireAuth,
  requireAdmin,
  adminRangoController.update
);
router.delete(
  "/admin/rangos/:id",
  requireAuth,
  requireAdmin,
  adminRangoController.remove
);

export default router;
