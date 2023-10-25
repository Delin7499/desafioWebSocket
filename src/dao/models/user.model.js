import mongoose, { mongo } from "mongoose";

const userCollection = "personas";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: String,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carritos" },
  role: { type: String, default: "user" },
});

const userModel = mongoose.model(userCollection, userSchema);

export { userModel };
