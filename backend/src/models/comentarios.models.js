import { Schema, model } from "mongoose";

const coment = new Schema(
  {
    producto: {
      type: Schema.Types.ObjectId,
      ref: "productos",
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "usuarios",
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("coments", coment);
