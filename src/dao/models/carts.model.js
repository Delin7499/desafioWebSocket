import mongoose from "mongoose";

const carritosCollectio = "carritos";

const carritosSchema = new mongoose.Schema({
  products: [
    {
      quantity: { type: Number },
      product: { type: mongoose.Schema.Types.ObjectId, ref: "productos" },
    },
  ],
});

export const carritosModel = mongoose.model(carritosCollectio, carritosSchema);
