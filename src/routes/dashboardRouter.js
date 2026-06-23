import { Router } from "express";
import { dashboard } from "../controllers/dashboardController.js";

export const dashboardRouter = Router();

dashboardRouter.get("/dashboard", dashboard);