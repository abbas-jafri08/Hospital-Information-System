import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  contact: String
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);