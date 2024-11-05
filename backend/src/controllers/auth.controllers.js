import bcrypt from "bcrypt";
import { generarJWT } from "../helpers/generarJWT.js";
import usuario from "../models/usuarios.model.js";
import { validationResult } from "express-validator";

// register
export const register = async (req, res) => {
  const { nombreUsuario, apellido, fechaNacimiento, email, password, nombre } =
    req.body;

  try {
    //validations
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json(errores);
    }

    const contrasenia = bcrypt.hashSync(password, 10);
    const userFind = await usuario.findOne({ email: email });

    userFind === null
      ? res.satus(302).json({ msg: "email not available" })
      : await new usuario({
          nombreUsuario,
          apellido,
          fechaNacimiento,
          email,
          contrasenia,
          nombre,
        })
          .save()
          .then(() => {
            res.status(200).json({ msg: "User registered successfully" });
          });
  } catch (error) {
    console.log("Internal Server Error ", error);
  }
};

//login with JWT
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json(errores);
    }

    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Insufficient data for authentication" });
    }

    const userFind = await usuario.findOne({ email });
    const correctPassword = bcrypt.compareSync(password, userFind.contrasenia);

    if (!userFind || !correctPassword) {
      return res.status(400).json({ msg: " incorrect email or password " });
    } else {
      const token = await generarJWT({ id: userFind.id });
      return res.status(200).json({
        exitoLogin: true,
        msg: "correct login",
        token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};
