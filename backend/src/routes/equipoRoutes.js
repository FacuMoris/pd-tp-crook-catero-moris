import { Router } from "express";

const router = Router();

import {
  index,
  store,
  show,
  update,
  activeTeams,
  history,
} from "../controllers/equipoController";

router.get("/equipos", index);

router.post("/equipos", store);

router.get("/equipos/:ID", show);

router.put("/equipos/:ID", update);

router.get("/equipos-activos", activeTeams);

router.get("/equipos/historial/:ID", history);

export default router;
