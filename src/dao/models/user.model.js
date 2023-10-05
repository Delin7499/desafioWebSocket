import mongoose, { mongo } from "mongoose";

const userCollection = "personas";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: String,
  password: String,
  role: { type: String, default: "user" },
});

const userModel = mongoose.model(userCollection, userSchema);

export { userModel };
