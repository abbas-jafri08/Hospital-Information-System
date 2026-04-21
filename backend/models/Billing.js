import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  amount: Number,
  status: String
}, { timestamps: true });

export default mongoose.model("Billing", billingSchema);