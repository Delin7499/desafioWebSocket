import { Router } from "express";
import CartManager from "../dao/DB/cartManager.js";

const cm = new CartManager();
const cartRouter = Router();

cartRouter.get("/", async (req, res) => res.send(await cm.getCarts()));

cartRouter.post("/", async (req, res) => {
  try {
    await cm.addCart();
    req.context.socketServer.emit(`carts`, await cm.getCarts());
    res.status(200).json();
  } catch (error) {
    res.status(500).send("Error");
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const carts = await cm.getCarts();
    const cart = carts.find((cart) => cart.id === req.params.cid);
    if (cart) {
      res.status(200).json(cart.products);
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    res.status(500).send("Error");
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    await cm.addToCart(cartId, productId);
    req.context.socketServer.emit(`carts`, await cm.getCarts());
    res.status(200).send("Product added to cart");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

export default cartRouter;
