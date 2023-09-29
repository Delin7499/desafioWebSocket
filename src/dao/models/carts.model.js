import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const carritosCollectio = "carritos";

const carritosSchema = new mongoose.Schema({
  products: {
    type: [
      {
        quantity: { type: Number },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "productos" },
      },
    ],
  },
});

carritosSchema.plugin(mongoosePaginate);

export const carritosModel = mongoose.model(carritosCollectio, carritosSchema);
