import { productosModel } from "../models/productos.model.js";

class ProductManager {
  async addProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) {
    const producto = await productosModel.create({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    });
    return producto;
  }

  async getProducts() {
    const productos = productosModel.find();
    return productos;
  }

  async deleteProduct(id) {
    console.log(id);
    productosModel.deleteOne({ _id: id }).catch(function (error) {
      console.log(error); // Failure
    });
  }
}

export default ProductManager;
