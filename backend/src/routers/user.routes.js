import { Router } from "express";
import { updatUser, deleteUser } from "../controllers/user.controllers.js";

export const userRoutes = Router();

userRoutes.post("/update", updatUser);
userRoutes.delete("/delete", deleteUser);
