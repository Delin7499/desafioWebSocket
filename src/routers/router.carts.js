import { Router } from "express";
import { carritosModel } from "../dao/models/carts.model.js";

const cartRouter = Router();

cartRouter.get("/", async (req, res) => res.send(await carritosModel.find()));

cartRouter.post("/", async (req, res) => {
  try {
    const cart = await carritosModel.create({ products: [] });
    req.context.socketServer.emit(
      `carts`,
      await carritosModel.find().populate("products.product").exec()
    );
  } catch (error) {
    res.status(500).send("Error");
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cart = await carritosModel
      .findOne({ _id: req.params.cid })
      .populate("products.product")
      .exec();
    if (cart) {
      res.status(200).send(cart.products);
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cart = await carritosModel.findOne({ _id: cartId });
  const oldProduct = cart.products.find(
    ({ product }) => product.toString() === productId
  );
  console.log("se busco el id " + productId);

  console.log("el producto es " + oldProduct);
  if (oldProduct) {
    oldProduct.quantity += 1;
  } else {
    cart.products.push({
      product: productId,
      quantity: 1,
    });
  }

  const update = await carritosModel.updateOne({ _id: cartId }, cart);
  req.context.socketServer.emit(
    `carts`,
    await carritosModel.find().populate("products.product").exec()
  );
  res.send(update);
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cart = await carritosModel.findOne({ _id: cartId });
  if (!cart) {
    res.status(404).send();
    return;
  }
  const indexToDelete = cart.products.findIndex(
    ({ product }) => (product = productId)
  );

  if (indexToDelete !== -1) {
    cart.products.splice(indexToDelete, 1);
  }
  const update = carritosModel.updateOne({ _id: cartId }, cart);
  res.send(update);
});

cartRouter.put("/:cid", (req, res) => {
  const { products } = req.body;
  const cartId = req.params.cid;
  const cart = carritosModel.findOne({ _id: cartId });
  if (!cart) {
    res.status(404).send();
    return;
  }

  cart.products = products;

  const update = carritosModel.updateOne({ _id: cartId }, cart);
  res.send(update);
});

cartRouter.put("/:cid/product/:pid", async (req, res) => {
  const { quantity } = req.body;
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cart = carritosModel.findOne({ _id: cartId });
  const oldProduct = cart.products.find(({ product }) => product === productId);

  if (oldProduct) {
    oldProduct.quantity = quantity;
  } else {
    res.status(404).send();
  }

  const update = await carritosModel.updateOne({ _id: cartId }, cart);

  res.send(update);
});

cartRouter.delete("/:cid", (req, res) => {
  const { products } = req.body;
  const cartId = req.params.cid;
  const cart = carritosModel.findOne({ _id: cartId });
  if (!cart) {
    res.status(404).send();
    return;
  }

  cart.products = [];

  const update = carritosModel.updateOne({ _id: cartId }, cart);
  res.send(update);
});

export default cartRouter;
