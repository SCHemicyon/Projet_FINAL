import { Router } from "express";

import {
    login,
    callback,
    logout
} from "../controllers/authController.js";

export const authRouter = Router();

authRouter.get("/auth/bnet", login);
authRouter.get("/auth/callback", callback);
authRouter.get("/auth/logout", logout);