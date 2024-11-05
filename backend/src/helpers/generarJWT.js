import jwt from "jsonwebtoken";
const { sign } = jwt;

export const generarJWT = (id) => {
  return new Promise((resolve, reject) => {
    sign(
      id,
      "mysecret",
      {
        expiresIn: 1700 * 1700,
      },
      (err, token) => {
        err ? reject(err) : resolve(token);
      }
    );
  });
};
