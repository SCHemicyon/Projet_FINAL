import { Router } from "express";
import { inspectionPage } from "../controllers/inspectionController.js";

export const inspectionRouter = Router();

inspectionRouter.get("/inspection", inspectionPage);