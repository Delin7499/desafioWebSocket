import { Router } from "express";
import { ProductManager } from "../dao/FileSystem/ProductManager.js";
import { carritosModel } from "../dao/models/carts.model.js";

const pm = new ProductManager();
const products = pm.getProducts();
const viewsRouter = Router();

viewsRouter.get(`/products`, (req, res) => res.render("home", {}));
viewsRouter.get("/carts/:cid", (req, res) => {
  const cartId = req.params.cid;
  res.render("cart", { cartId });
});

viewsRouter.get(`/realtimeproducts`, (req, res) =>
  res.render("realTimeProducts", {})
);
viewsRouter.get(`/realtimecarts`, (req, res) =>
  res.render(`realTimeCarts`, {})
);

viewsRouter.get("/chat", (req, res) => res.render("chat", {}));

export default viewsRouter;
