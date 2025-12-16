import { Router } from "express";
import * as rangoController from "../controllers/rangoController.js";

const router = Router();

router.get("/rangos", rangoController.list);

export default router;
