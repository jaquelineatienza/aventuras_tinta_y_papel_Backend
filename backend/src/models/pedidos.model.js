import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);
const pedidos = new Schema({
  numPedido: {
    type: Number,
    required: true,
  },
  productos: [
    {
      producto: {
        type: Schema.Types.ObjectId,
        ref: "productos",
      },
      cantidad: {
        type: Number,
        default: 1,
        required: true,
      },
    },
  ],
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "usuarios",
    required: true,
  },
  totalFinal: {
    type: Number,
    required: true,
  },
  estado: {
    type: String,
    required: true,
    default: "incompleto",
  },
  fecha: { type: Date, default: Date.now },
});
pedidos.plugin(AutoIncrement, { inc_field: "numPedido" });
export default model("pedidoModel", pedidos);
