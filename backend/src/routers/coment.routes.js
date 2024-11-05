import { Router } from "express";
import { creatcoment } from "../controllers/coment.cotroller.js";
export const comentRouter = Router();

comentRouter.put("/", creatcoment);
