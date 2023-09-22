import { Router } from "express";
import ProductManager from "../dao/DB/ProductManager.js";

const pm = new ProductManager();

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const productos = await pm.getProducts();
  if (req.query.limit) {
    return res.send(productos.slice(0, req.query.limit));
  }
  return res.status(200).send(productos);
});

productRouter.get("/:pid", (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  const p = pm.getProductById(pid);
  if (p) {
    res.status(200).send(p);
  } else {
    res.status(404).send();
  }
});

productRouter.post(`/`, async (req, res) => {
  console.log(req.body);
  if (
    req.body.title &&
    req.body.description &&
    req.body.code &&
    req.body.price &&
    req.body.status &&
    req.body.stock &&
    req.body.category
  ) {
    const thumbnail = req.body.thumbnail ?? "";
    try {
      await pm.addProduct(
        req.body.title,
        req.body.description,
        req.body.code,
        req.body.price,
        req.body.status,
        req.body.stock,
        req.body.category,
        thumbnail
      );
      res.status(200).send();
      req.context.socketServer.emit(`products`, await pm.getProducts());
    } catch (error) {
      res.status(400).send(error);
    }
  } else {
    res.status(400).send();
  }
});

productRouter.delete("/:pid", async (req, res) => {
  try {
    await pm.deleteProduct(req.params.pid);
    req.context.socketServer.emit(`products`, await pm.getProducts());
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

productRouter.put("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  const updatedData = req.body;

  try {
    await pm.updateProduct(pid, updatedData);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

export default productRouter;
