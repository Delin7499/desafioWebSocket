import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const categoriasCollectio = "categorias";

const categoriasSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

categoriasSchema.plugin(mongoosePaginate);
export const categoriasModel = mongoose.model(
  categoriasCollectio,
  categoriasSchema
);
