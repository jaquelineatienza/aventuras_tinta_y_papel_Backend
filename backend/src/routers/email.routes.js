import { Router } from "express";

import { email } from "../controllers/email.controller.js";

export const emailRouter = Router();

emailRouter.post("/", email);
