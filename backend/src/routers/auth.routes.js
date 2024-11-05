import { register, login } from "../controllers/auth.controllers.js";
import { logout, session } from "../controllers/auth.sesion.controller.js";
import { sessionVerified } from "../../middlewares/session.js";
import { Router } from "express";
import {
  regisValidation,
  loginValidation,
} from "../validations/authValidations.js";
import { applyValidations } from "../validations/applyValidations.js";

export const authRouter = Router();

//router register
authRouter.post("/register", regisValidation, applyValidations, register);

// router login user
authRouter.post("/login", session, login);
//router logout
authRouter.post("/logout", sessionVerified, logout);
