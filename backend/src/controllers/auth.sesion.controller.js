import usuario from "../models/usuarios.model.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

//login with session
export const session = async (req, res) => {
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
      req.session.userId = userFind.id;
      req.session.username = userFind.nombreUsuario;
      req.session.rol = userFind.rol;

      return res.json({
        msg: "Login successful",
        user: req.session.username,
        role: req.session.rol,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

//logout controller
export const logout = async (req, res) => {
  console.log(req.session);
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "error closing session" });
    }
    res.clearCookie("connect.sid");

    return res.json({ message: "Session closed successfully" });
  });
};
