import { Router } from "express";
import * as rolController from "../controllers/rolController.js";

const router = Router();

router.get("/roles", rolController.list);

export default router;
