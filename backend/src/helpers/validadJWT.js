import jwt from "jsonwebtoken"; // Importar jwt como un todo
import usuario from "../models/usuarios.model.js";

// función para validar jwt
export const validarJWT = async (token) => {
  try {
    // Llamar a jwt.verify directamente
    const { id } = jwt.verify(token, "mysecret");

    // función para buscar al usuario
    const usuarioEncontrado = await usuario.findById(id);

    if (!usuarioEncontrado) {
      return false;
    } else {
      return usuarioEncontrado;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
