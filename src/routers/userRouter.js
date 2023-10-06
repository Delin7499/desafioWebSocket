import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    return res.send("Already registered");
  }

  const user = userModel.create({
    first_name,
    last_name,
    email,
    age,
    password,
  });

  req.session.first_name = first_name;
  req.session.last_name = last_name;
  req.session.email = email;
  req.session.age = age;
  req.session.isLogged = true;
  req.session.role = user.role;

  res.redirect("/products");
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === "adminCoder@coder.com" || password === "adminCod3r123") {
    req.session.first_name = "admin";
    req.session.last_name = "admin";
    req.session.email = email;
    req.session.age = 0;
    req.session.isLogged = true;
    req.session.role = "admin";
    return res.redirect("/products");
  }
  const user = await userModel.findOne({ email, password });

  if (!user) {
    return res.send("Tus credenciales son incorrectas");
  }
  req.session.first_name = user.first_name;
  req.session.last_name = user.last_name;
  req.session.email = user.email;
  req.session.age = user.age;
  req.session.isLogged = true;
  req.session.role = user.role;

  res.redirect("/products");
});

userRouter.get("/logout", (req, res) => {
  req.session.isLogged = false;
  req.session.first_name = undefined;
  req.session.last_name = undefined;
  req.session.email = undefined;
  req.session.age = undefined;
  req.session.role = undefined;

  res.redirect("/login");
});
export default userRouter;
