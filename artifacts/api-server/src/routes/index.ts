import { Router, type IRouter } from "express";
import healthRouter from "./health";
import campusosRouter from "./campusos";

const router: IRouter = Router();

router.use(healthRouter);
router.use(campusosRouter);

export default router;
