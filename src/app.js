import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { ProductManager } from "./ProductManager.mjs";
import productRouter from "./routers/router.productos.js";
import cartsRouter from "./routers/router.carts.js";
import viewsRouter from "./routers/viewsRouter.js";

const pm = new ProductManager();
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

socketServer.on(`connection`, (socket) => {
  console.log(`Se conecto el usuario con id: ${socket.id}`);

  socket.emit(`products`, pm.getProducts());
});
