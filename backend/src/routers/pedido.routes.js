import { Router } from "express";
import {
  addCart,
  uptdaOrder,
  deletItem,
  deletOrder,
  getOrder,
  getAllOrders,
} from "../controllers/pedidos.controllers.js";
import { sessionVerified, rolAdmVerified } from "../../middlewares/session.js";

export const order = Router();

//add product to cart
order.post("/", sessionVerified, addCart);
//update order
order.put("/", sessionVerified, uptdaOrder);
//delete order
order.delete("/", sessionVerified, deletOrder);
//delete item of the order
order.delete("elemento/:id", sessionVerified, deletItem);
//get order for id user
order.get("/", sessionVerified, getOrder);
//get all orders
order.get("/orders", rolAdmVerified, getAllOrders);
