import { PAYPAL_API, PAYPAL_API_KEY, PAYPAL_API_CLIENT } from "../config.js";
import axios from "axios";
import dotenv from "dotenv";
import pedidos from "../models/pedidos.model.js";
import productos from "../models/productos.model.js";
import mongoose from "mongoose";

dotenv.config();

const port = process.env.PORT;

export const createOrder = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({
        msg: "Debe registrarse para realizar esa tarea",
      });
    }

    const usuario = await validarJWT(token);
    const idUsuario = usuario._id;

    if (!idUsuario) {
      return res.status(401).json({
        msg: "Token inválido",
      });
    }
    // Buscar el pedido del usuario
    const pedido = await pedidos.findOne({
      usuario: new mongoose.Types.ObjectId(idUsuario),
    });

    if (!pedido) {
      return res
        .status(404)
        .json({ msg: "No se encontró un pedido para este usuario." });
    }

    // Iterar sobre los productos del pedido
    for (const items of pedido.productos) {
      const productoId = items.producto;
      const cantidad = items.cantidad;

      // Buscar el producto por su ID
      const producto = await productos.findById(productoId);
      if (!producto) {
        throw new Error(`Producto con ID ${productoId} no encontrado`);
      }

      // Verificar stock
      if (producto.stock < cantidad) {
        throw new Error(
          `Stock insuficiente para el producto: ${producto.nombre}`
        );
      }
    }

    // Crear la orden de PayPal
    const aMount = pedido.totalFinal;
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: aMount,
          },
        },
      ],
      application_context: {
        brand_name: "Nueva Tienda",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `http://localhost:${port}/capture-order`,
        cancel_url: `http://localhost:${port}/cancel-order`,
      },
    };

    // Obtener el access token de PayPal
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const { data } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
      auth: {
        username: PAYPAL_API_CLIENT,
        password: PAYPAL_API_KEY,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const accessToken = data.access_token;

    // Crear la orden de PayPal
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Devolver la respuesta al cliente
    res.json({
      msg: "Orden creada correctamente",
      orderId: response.data.id,
      approvalUrl: response.data.links.find((link) => link.rel === "approve")
        .href,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear la orden");
  }
};
//funcion para capturar las ordenes
export const captOrder = async (req, res) => {
  //!token obtenido de paypal
  const { token: paypalToken } = req.query; // Renombrar para evitar conflicto de nombres
  //!sesion de mongodb
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userToken = req.headers.token; // Renombrar para evitar conflicto de nombres
    // if (!userToken) {
    //   return res.status(401).json({
    //     msg: "Debe registrarse para realizar esa tarea",
    //   });
    // }

    // const usuario = await validarJWT(userToken);
    // const idUsuario = usuario._id;

    // if (!idUsuario) {
    //   return res.status(401).json({
    //     msg: "Token inválido",
    //   });
    // }
    let idUsuario = "66bb6e8f1a0e088b84ae0cc0";
    // Buscar el pedido del usuario
    const pedido = await pedidos
      .findOne({
        usuario: new mongoose.Types.ObjectId(idUsuario),
      })
      .session(session);

    if (!pedido) {
      throw new Error("Pedido no encontrado");
    }

    // Recorrer los productos del pedido
    for (const items of pedido.productos) {
      const productoId = items.producto;
      const cantidad = items.cantidad;

      if (!cantidad || cantidad <= 0) {
        throw new Error(`Cantidad no válida para el producto: ${productoId}`);
      }

      const producto = await productos.findById(productoId);
      if (!producto) {
        throw new Error(`Producto con ID ${productoId} no encontrado`);
      }
      // Verificar si el producto tiene stock
      if (typeof producto.stock === "undefined") {
        throw new Error(
          `El producto con ID ${productoId} no tiene campo de stock`
        );
      }
      console.log("prod stock", producto.stock);
      const newStock = producto.stock - cantidad;
      console.log("new stock", newStock);
      console.log(cantidad);
      await producto.updateOne({ $set: { stock: newStock } });
    }

    // Actualizar el estado del pedido a "pendiente"
    pedido.estado = "pendiente";
    await pedido.save({ session });

    // Finalizar la transacción
    await session.commitTransaction();
    session.endSession();

    // Capturar el pago con PayPal
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${paypalToken}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_KEY,
        },
      }
    );
    console.log(response.data);
    return res.send("Pedido pagado correctamente");
  } catch (error) {
    // En caso de error, deshacer la transacción
    await session.abortTransaction();
    session.endSession();

    console.error("Error al procesar el pedido:", error.message);

    // Manejar error de PayPal si existe
    if (error.response) {
      console.log("Error de PayPal:", error.response.data);
    } else {
      console.log("Error general:", error.message);
    }

    res.status(500).send("Error al capturar la orden");
  }
};
