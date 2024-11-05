import {
  createPublic,
  editPublics,
  getAllpublics,
  deletPublic,
} from "../controllers/public.controllers.js";
import { sessionVerified } from "../../middlewares/session.js";
import {
  publicValidation,
  updateValidation,
} from "../validations/publicValidations.js";
import { subirImagen } from "../../middlewares/storage.js";
import { Router } from "express";
export const publiRouter = Router();

//ruta para cargar los productos
publiRouter.post("/cargar", subirImagen.single("imagen"), createPublic);
//update publics
publiRouter.put("/edit", sessionVerified, updateValidation, editPublics);
//get publics
publiRouter.get("/obtener", sessionVerified, getAllpublics);
//delete publics
publiRouter.delete("/delete/", sessionVerified, deletPublic);
