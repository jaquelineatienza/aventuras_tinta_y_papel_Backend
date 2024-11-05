import { Router } from "express";

import { addToFav, getFavs, deleteFavs } from "../controllers/favorit.controllers.js";

export const favoritos = Router();
//add  to favorites
favoritos.post("/addFav", addToFav);
//get favs
favoritos.get("/getFav", getFavs);
//delete fav
favoritos.delete("/delete", deleteFavs);
