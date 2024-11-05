import usuario from "../models/usuarios.model.js";

//update users
export const updatUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const token = req.headers.token;
    if (!token) {
      return res
        .status(401)
        .json({ msg: "You must register to perform this task" });
    }
    const usuario = await validarJWT(token);

    !usuario
      ? res.status(401).json({ msg: "invalid token" })
      : (idUser = usuario._id);
    const userUpdate = { username, password, email };

    const result = usuario.findByIdAndUpdate(idUser, userUpdate, { new: true });
    !result
      ? res.status(404).json({ msg: "error updating user" })
      : res.status(201).json({ msg: "user update" });
  } catch (error) {
    console.log("Internal Server Error ", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};
//delete user
export const deleteUser = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res
        .status(401)
        .json({ msg: "You must register to perform this task" });
    }
    const usuario = await validarJWT(token);

    !usuario
      ? res.status(401).json({ msg: "invalid token" })
      : (idUser = usuario._id);
    const userUpdate = { username, password, email };

    const result = usuario.findByIdAndUpdate(idUser, userUpdate, { new: true });
    !result
      ? res.status(404).json({ msg: "error deleting user" })
      : res.status(201).json({ msg: "user delete" });
  } catch (error) {
    console.log("Internal Server Error ", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};
