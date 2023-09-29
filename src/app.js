import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./dao/DB/productManager.js";
import MessageManager from "./dao/DB/MessageManager.js";
import productRouter from "./routers/router.productos.js";
import { carritosModel } from "./dao/models/carts.model.js";
import cartsRouter from "./routers/router.carts.js";
import viewsRouter from "./routers/viewsRouter.js";
import mongoose from "mongoose";
import CartManager from "./dao/DB/cartManager.js";
const mm = new MessageManager();
const pm = new ProductManager();
const cm = new CartManager();
const app = express();
app.use((req, res, next) => {
  req.context = { socketServer };
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(8080, () => console.log(`Running......`));
const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", `./src/views`);
app.set("view engine", "handlebars");
app.use(express.static(`./src/public`));
app.use(`/api/products`, productRouter);
app.use(`/api/carts`, cartsRouter);
app.use(`/`, viewsRouter);

mongoose.connect(
  `mongodb+srv://matimbarcelo:XGl7s3cj2FYYoa64@cluster0.l5ohzsm.mongodb.net/?retryWrites=true&w=majority`
);

socketServer.on(`connection`, async (socket) => {
  console.log(`Se conecto el usuario con id: ${socket.id}`);

  socket.emit(`products`, await pm.getProducts());
  socket.emit("categories", await pm.getCategories());
  socket.emit(`nuevo_mensaje`, await mm.getMessages());
  socket.emit("carts", await cm.getCarts());

  socket.on("cartId", async (cartId) => {
    const cart = await carritosModel.findOne({ _id: cartId });
    console.log(cart);
    socket.emit("cart", cart);
  });

  socket.on(`mensaje`, async (data) => {
    mm.addMessage(data);
    const messages = await mm.getMessages();
    socketServer.emit("nuevo_mensaje", messages);
  });
});

socketServer.on("cartId", async (cartId) => {
  const cart = await carritosModel.findOne({ _id: cartId });
  console.log(cart);
  socket.emit("cart", cart);
});
