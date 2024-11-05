import { Schema, model } from "mongoose";

const usuario = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    fechaNacimiento: {
      type: String,
      required: true,
      trim: true,
    },
    nombreUsuario: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    contrasenia: {
      type: String,
      required: true,
      bcrypt: true,
    },
    rol: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    favorites: [
      {
        producto: {
          type: Schema.Types.ObjectId,
          ref: "productos",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("usuario", usuario);
