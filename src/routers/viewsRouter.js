import { Router } from "express";
import { ProductManager } from "../dao/FileSystem/ProductManager.js";

const pm = new ProductManager();
const products = pm.getProducts();
const realTimeProductsRouter = Router();

realTimeProductsRouter.get(`/`, (req, res) => res.render("home", { products }));
realTimeProductsRouter.get(`/realtimeproducts`, (req, res) =>
  res.render("realTimeProducts", {})
);
realTimeProductsRouter.get(`/realtimecarts`, (req, res) =>
  res.render(`realTimeCarts`, {})
);

realTimeProductsRouter.get("/chat", (req, res) => res.render("chat", {}));

export default realTimeProductsRouter;
