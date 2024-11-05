import { Router } from "express";

import { autFilter } from "../controllers/filters.controlers.js";
export const filRoutes = Router();

//routes for search
filRoutes.get("/", autFilter);
