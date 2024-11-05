import { Router } from "express";
import { captOrder, createOrder } from "../controllers/payment.controllers.js";
export const payrouter = Router();

payrouter.get("/create-order", createOrder);
payrouter.post("/create-order", createOrder);

payrouter.post("/capture-order", captOrder);
payrouter.get("/capture-order", captOrder);

payrouter.get("/", (req, res) => {
  res.send("hello");
});
payrouter.get("/cancel-order", (req, res) => {
  res.json({ msg: "peticion cancelada" });
});
