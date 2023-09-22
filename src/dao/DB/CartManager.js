import { carritosModel } from "../models/carts.model.js";

class CartManager {
  async getCarts() {
    return carritosModel.find().populate("products.product").exec();
  }
  async addCart() {
    const cart = await carritosModel.create();
    return cart;
  }

  async addToCart(cartId, product) {
    let cart = await carritosModel.findById(cartId);

    if (!cart) {
      cart = new carritosModel({
        _id: cartId,
        products: [{ quantity: 1, product }],
      });
    } else {
      const existingProduct = cart.products.find((prod) =>
        prod.product.equals(product)
      );

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ quantity: 1, product });
      }
    }

    await cart.save();
  }
}

export default CartManager;
