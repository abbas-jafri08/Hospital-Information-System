import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String
}, { timestamps: true });

export default mongoose.model("User", userSchema);