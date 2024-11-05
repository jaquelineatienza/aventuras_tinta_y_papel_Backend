import Producto from "../models/productos.model.js";
import Usuario from "../models/usuarios.model.js";
import mongoose from "mongoose"; // Para usar ObjectId

const { ObjectId } = mongoose;

//create coments
export const creatcoment = async (req, res) => {
  try {
    const { idProducto, body } = req.body;
    const token = req.headers.token;

    if (!token) {
      return res
        .status(401)
        .json({ msg: "You must register to be able to perform this task" });
    }

    const usuario = await validarJWT(token);
    if (!usuario) {
      return res.status(401).json({ msg: "Invalid Token" });
    }

    const idUsuario = usuario._id;
    const ObjectId = new mongoose.Types.ObjectId();

    // Encuentra el usuario y el producto
    const usuarioEncontrado = await Usuario.findById(idUsuario);
    const prodFind = await Producto.findById(idProducto);

    if (!prodFind) {
      return res.status(404).json({ msg: "Usuario o producto no encontrado" });
    }
    if (!usuarioEncontrado) {
      return res.status(404).json({ msg: "Usuario  no encontrado" });
    }

    // Agregar comentario al array de comentarios del producto
    prodFind.comentarios.push({
      usuario: usuarioEncontrado._id,
      body: body,
    });

    // Guardar el producto actualizado
    await prodFind.save();

    res.status(200).json({ msg: "Comentario añadido con éxito" });
  } catch (error) {
    res.status(500).json({ msg: "Error interno del servidor", error });
  }
};

//delete coment
export const delComent = async (req, res) => {
  try {
    const { idProducto } = req.body;
    const token = req.headers.token;

    if (!token) {
      return res
        .status(401)
        .json({ msg: "You must register to be able to perform this task" });
    }

    const usuario = await validarJWT(token);
    if (!usuario) {
      return res.status(401).json({ msg: "Invalid Token" });
    }

    const idUsuario = usuario._id;
    const ObjectId = new mongoose.Types.ObjectId();

    // Encuentra el producto
    const prodFind = await Producto.findById(idProducto);

    if (!prodFind) {
      return res.status(404).json({ msg: "Product not find" });
    }

    const userFind = await usuario.findById(idUsuario);
    // Encuentra el comentario dentro del array de comentarios
    const comentFind = prodFind.comentarios.find(
      (comentario) =>
        comentario.usuario && comentario.usuario.toString() === idUsuario
    );

    if (!comentFind) {
      return res.status(404).json({ msg: "coment not find" });
    }
    if (!comentFind || !userFind.admin) {
      res
        .status(401)
        .json({ msg: "You are not authorized to perform the following task" });
    }
    // Elimina el comentario del array utilizando su _id
    await Producto.updateOne(
      { _id: idProducto },
      { $pull: { comentarios: { _id: comentFind._id } } }
    );

    res.status(200).json({ msg: "comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Interval server error ", error });
  }
};

//update coment
export const updaComent = async (req, res) => {
  try {
    const { idProducto, newBody } = req.body;
    const token = req.headers.token;

    if (!token) {
      return res
        .status(401)
        .json({ msg: "You must register to be able to perform this task" });
    }

    const usuario = await validarJWT(token);
    if (!usuario) {
      return res.status(401).json({ msg: "Invalid Token" });
    }

    const idUsuario = usuario._id;
    const ObjectId = new mongoose.Types.ObjectId();

    // find the product
    const prodFind = await Producto.findById(idProducto);

    if (!prodFind) {
      return res.status(404).json({ msg: "Product not find" });
    }

    const userFind = await usuario.findById(idUsuario);
    if (userFind) {
      res.status(404).json({ msg: "user not find" });
    }

    const comentFind = prodFind.comentarios.find(
      (comentario) =>
        comentario.usuario && comentario.usuario.toString() === idUsuario
    );
    if (!comentFind) {
      res.status(404).json({ msg: "Coment not find" });
    }

    prodFind.comentarios.push({
      usuario: userFind._id,
      body: body,
    });

    const result = await prodFind.save();
    !result
      ? res.status(301).json({ msg: "error updating comment" })
      : res.status(200).json({ msg: "updated comment" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ msg: "interval server error", error });
  }
};
