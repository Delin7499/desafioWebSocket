import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./dao/DB/productManager.js";
import MessageManager from "./dao/DB/MessageManager.js";
import productRouter from "./routers/router.productos.js";
import { carritosModel } from "./dao/models/carts.model.js";
import cartsRouter from "./routers/router.carts.js";
import viewsRouter from "./routers/viewsRouter.js";
import userRouter from "./routers/userRouter.js";
import mongoose from "mongoose";
import CartManager from "./dao/DB/cartManager.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import sessionRouter from "./routers/sessionRouter.js";

const mm = new MessageManager();
const pm = new ProductManager();
const cm = new CartManager();

const app = express();

mongoose.connect(
  `mongodb+srv://matimbarcelo:XGl7s3cj2FYYoa64@cluster0.l5ohzsm.mongodb.net/?retryWrites=true&w=majority`
);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://matimbarcelo:XGl7s3cj2FYYoa64@cluster0.l5ohzsm.mongodb.net/?retryWrites=true&w=majority`,
      ttl: 1000000,
    }),
    secret: "coderSectret",
    resave: false,
    saveUninitialized: false,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser("CoderSecurity"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(8080, () => console.log(`Running......`));
const socketServer = new Server(httpServer);
app.use((req, res, next) => {
  req.context = { socketServer };
  next();
});

app.engine("handlebars", handlebars.engine());
app.set("views", `./src/views`);
app.set("view engine", "handlebars");

app.use(express.static(`./src/public`));

app.use(`/api/products`, productRouter);
app.use(`/api/carts`, cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/session", sessionRouter);
app.use(`/`, viewsRouter);

socketServer.on(`connection`, async (socket) => {
  console.log(`Se conecto el usuario con id: ${socket.id}`);
  socket.emit(`products`, await pm.getProducts());
  socket.emit("categories", await pm.getCategories());
  socket.emit(`nuevo_mensaje`, await mm.getMessages());
  socket.emit("carts", await cm.getCarts());

  socket.on("cartId", async (cartId) => {
    const cart = await carritosModel.findOne({ _id: cartId }).lean();
    ``;
    console.log(cart);
    socket.emit("cart", cart);
  });

  socket.on(`mensaje`, async (data) => {
    mm.addMessage(data);
    const messages = await mm.getMessages();
    socketServer.emit("nuevo_mensaje", messages);
  });
});
