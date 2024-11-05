import mongoose from "mongoose";
import publics from "../models/public.models.js";
import { validarJWT } from "../helpers/validadJWT.js";
// Create public
export const createPublic = async (req, res) => {
  try {
    const token = req.headers.token;
    console.log(token);

    const { title, description, price, type, phone } = req.body;
    let imagen = "";

    if (req.file) {
      imagen = "/uploads/" + req.file.filename;
    } else {
      return res.status(400).json({ msg: "the image is required" });
    }

    if (!token) {
      console.log("Token invuesto");

      return res
        .status(401)
        .json({ msg: "Debe registrarse para realizar esa tarea" });
    }

    const user = await validarJWT(token);
    if (!user) {
      console.log("Token invuesto");

      return res.status(401).json({ msg: "Token inválido" });
    }

    const idUser = user._id;
    const newPublic = new publics({
      title,
      autor: idUser,
      description,
      price,
      imagen,
      type,
      phone,
    });

    const result = await newPublic.save();
    if (!result) {
      return res.status(400).json({ msg: "error uploading post" });
    }
    return res.status(201).json({ msg: "post uploaded" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//get all publics or for id
export const getAllpublics = async (req, res) => {
  try {
    const { id } = req.body;
    const getPublics =
      id === undefined
        ? await publics.find()
        : await publics.find({ autor: id });

    //not publics
    if (!getPublics) {
      res.status(402).json({ msg: "no post" });
    }
    return res.status(200).json({ getPublics });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

//edit publics for id
export const editPublics = async (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res
        .status(401)
        .json({ msg: "Debe registrarse para realizar esa tarea" });
    }

    const usuario = await validarJWT(token);
    if (!usuario) {
      return res.status(401).json({ msg: "invalid token" });
    }
    const idUser = usuario._id;
    const ObjectId = mongoose.Types.ObjectId;

    const { author, title, price, description } = req.body;
    console.log(author, title, price, description);

    const publicFind = await publics.findOne({ autor: idUser });

    if (!publicFind) {
      return res.status(402).json({ msg: "Post not found" });
    }

    if ((usuario.rol === "user") & (idUser != publicFind.autor)) {
      res.status(401).json({ msg: "You are not the author of this post" });
    }

    const id = publicFind._id;

    const updatedData = {
      author,
      title,
      price,
      description,
    };

    const result = await publics.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true }
    );

    if (!result) {
      return res.status(304).json({ msg: "Post not updated" });
    }

    return res.status(200).json({ msg: "Post updated", result });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

//delet public
export const deletPublic = async (req, res) => {
  try {
    // const { idUser } = req.params;
    const token = req.headers.token;

    if (!token) {
      return res
        .status(401)
        .json({ msg: "Debe registrarse para realizar esa tarea" });
    }

    const usuario = await validarJWT(token);
    if (!usuario) {
      return res.status(401).json({ msg: "Token inválido" });
    }
    const idUser = usuario._id;
    const ObjectId = mongoose.Types.ObjectId;
    const publicFind = await publics.findOne({ autor: idUser });

    if (!publicFind) {
      res.status(402).json({ msg: "not post" });
    }

    if ((usuario.rol === "user") & (idUser != publicFind.autor)) {
      res.status(401).json({ msg: "You are not the author of this post" });
    }

    const idPublic = publicFind._id;

    // Eliminamos el post usando el _id directamente
    const result = await publics.findByIdAndDelete(idPublic);

    if (!result) {
      res.status(304).json({ msg: "Post not delete" });
    } else {
      res.status(201).json({ msg: "post delete" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error ", error });
  }
};
