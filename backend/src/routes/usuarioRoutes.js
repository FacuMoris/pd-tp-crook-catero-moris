import { Router } from "express";
import * as usuarioController from "../controllers/usuarioController.js";
import { requireAuth } from "../middleware/auth.js";
import { logout } from "../controllers/usuarioController.js";

const router = Router();

router.post("/register", usuarioController.register);
router.post("/login", usuarioController.login);
router.get("/welcome", requireAuth, usuarioController.welcome);
router.get("/refresh-token", usuarioController.refreshToken);
router.post("/logout", requireAuth, logout);

export default router;
