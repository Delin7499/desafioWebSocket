import { Router } from "express";
import { ProductManager } from "../ProductManager.mjs";

const pm = new ProductManager();
const products = pm.getProducts();
const realTimeProductsRouter = Router();

realTimeProductsRouter.get(`/`, (req, res) => res.render("home", { products }));
realTimeProductsRouter.get(`/realtimeproducts`, (req, res) =>
  res.render("realTimeProducts", {})
);

export default realTimeProductsRouter;
