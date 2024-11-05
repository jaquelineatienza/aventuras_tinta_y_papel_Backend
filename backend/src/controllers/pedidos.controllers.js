import pedidos from "../models/pedidos.model.js";
import mongoose from "mongoose";
import usuario from "../models/usuarios.model.js";
import producto from "../models/productos.model.js";
import { validarJWT } from "../helpers/validadJWT.js";

// add item of the cart
export const addCart = async (req, res) => {
  try {
    const { totalFinal, productos } = req.body;
    const token = req.headers.token;

    if (!token) {
      return res
        .status(401)
        .json({ msg: "You must register to be able to perform this task" });
    }

    const user = await validarJWT(token);
    if (!user) {
      return res.status(401).json({ msg: "Invalid Token" });
    }

    const idUsuario = user._id;
    const ObjectId = new mongoose.Types.ObjectId();

    if (!idUsuario || !totalFinal || !productos || productos.length === 0) {
      return res.status(400).json({ msg: "incomplete data" });
    }

    // Extraer el primer producto del array
    const { idProducto, cantidad = 1 } = productos[0];

    const obtProducto = await producto.findById(idProducto);
    if (!obtProducto) {
      return res.status(404).json({ msg: "product not find" });
    }

    const cardFind = await pedidos.findOne({ usuario: idUsuario });
    let numPedido = cardFind ? cardFind.numPedido : 1;

    //create new card
    if (!cardFind || cardFind.estado == "pendiente") {
      const newPedido = new pedidos({
        productos: [
          {
            producto: idProducto,
            cantidad: cantidad,
          },
        ],
        totalFinal,
        usuario: idUsuario,
        numPedido,
      });

      await newPedido.save();
      return res.json(newPedido);
    } else {
      const prodFind = cardFind.productos.find(
        (p) => p.producto && p.producto.toString() === idProducto
      );

      if (prodFind) {
        prodFind.cantidad += cantidad;
      } else {
        cardFind.productos.push({
          producto: idProducto,
          cantidad: cantidad,
        });
      }

      await cardFind.save();
      return res.json(cardFind);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

//update orders
export const uptdaOrder = async (req, res) => {
  try {
    const { id, state } = req.body;
    const estado = state;
    const resultado = await pedidos.findByIdAndUpdate(
      id,
      { estado: state },
      {
        new: true,
      }
    );
    if (!resultado) {
      return res.status(404).json({ msg: "order not find" });
    } else {
      return res.status(200).json({ msg: "updated order", resultado });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error " });
  }
};

//delete items of the cart
export const deletItem = async (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res
        .status(401)
        .json({ msg: "You must register to be able to perform this task" });
    }

    const user = await validarJWT(token);
    if (!user) {
      return res.status(401).json({ msg: "Invalid Token" });
    }

    const idUsuario = user._id;
    const ObjectId = new mongoose.Types.ObjectId();

    const result = await pedidos.updateOne(
      { usuario: idUsuario },
      { $pull: { productos: { producto: new ObjectId(idProducto) } } }
    );

    if (!result.modifiedCount) {
      return res.status(404).json({ msg: "Product not find" });
    }

    const cardFind = await pedidos.findOne({ usuario: idUsuario });

    if (cardFind.productos.length === 0) {
      await pedidos.findOneAndDelete({ usuario: idUsuario });
      return res.status(200).json({ msg: "Delete order" });
    }

    return res.status(200).json({ msg: "the product was eliminated " });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Interval server error" });
  }
};

// delete order
export const deletOrder = async (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res
        .status(401)
        .json({ msg: "You must register to be able to perform this task" });
    }

    const user = await validarJWT(token);
    if (!user) {
      return res.status(401).json({ msg: "Invalid Token" });
    }

    const idUsuario = user._id;
    const ObjectId = new mongoose.Types.ObjectId();
    const result = await pedidos.findOneAndDelete({ usuario: idUsuario });

    if (!result) {
      return res.status(404).json({ msg: "order not find" });
    }

    return res.status(200).json({ msg: "Delete order" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Interval server error" });
  }
};

// get order for user id
export const getOrder = async (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res
        .status(401)
        .json({ msg: "You must register to be able to perform this task" });
    }

    const user = await validarJWT(token);
    if (!user) {
      return res.status(401).json({ msg: "Invalid Token" });
    }

    const idUsuario = user._id;
    const ObjectId = new mongoose.Types.ObjectId();
    // Buscar el pedido y poblar los productos
    const result = await pedidos
      .findOne({ usuario: new mongoose.Types.ObjectId(idUsuario) })
      .populate("productos.producto");

    if (!result) {
      return res.status(404).json({ msg: "order not find" });
    }

    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Interval error sever" });
  }
};

//get all oders
export const getAllOrders = async (req, res) => {
  try {
    const result = await pedidos.find();

    if (result.length === 0) {
      res.status(204).json({ msg: "There are no orders" });
    }
  } catch (error) {
    console.log("server error", error);
    return res.status(500).json({ msg: "interval error server" });
  }
};
