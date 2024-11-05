//dependencias
import express from "express";
import cors from "cors";
import session from "express-session";
import path from "path";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "./database/db.js";

//importacion de rutas
import { authRouter } from "./routers/auth.routes.js";
import { order } from "./routers/pedido.routes.js";
import { producRouter } from "./routers/productos.routes.js";
import { publiRouter } from "./routers/public.routes.js";
import { favoritos } from "./routers/fav.routes.js";
import { filRoutes } from "./routers/filter.routes.js";
import { payrouter } from "./routers/payment.routes.js";
import { comentRouter } from "./routers/coment.routes.js";
import { supRouter } from "./routers/supplier.routes.js";
import { userRoutes } from "./routers/user.routes.js";
import { emailRouter } from "./routers/email.routes.js";

const __dirname = path.resolve();
//inicializacion de el servidor
const app = express();

//aplicacion de los middlewares
app.use(
  cors({
    // Permitir solicitudes desde el front-end
    origin: [
      "http://localhost:5500",
      "http://localhost:3000",
      "http://localhost:5173",
    ],

    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.static("./public"));
app.use(morgan("dev"));
app.use(express.json());
dotenv.config();
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "mi_secreto",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
//rutas
app.use("/api/auth", authRouter);
app.use("/api/pedidos", order);
app.use("/api/productos", producRouter);
app.use("/api/favoritos", favoritos);
app.use("/api/filters", filRoutes);
app.use("/api/", payrouter);
app.use("/api/coments", comentRouter);
app.use("/api/publics", publiRouter);
app.use("/api/supplier", supRouter);
app.use("/api/user", userRoutes);
app.use("/api/email", emailRouter);

//configuracion del puerto
const port = process.env.PORT || 3400;
app.listen(port, () => {
  console.log(
    `El servidor está funcionando en el puerto http://localhost:${port}`
  );
});
