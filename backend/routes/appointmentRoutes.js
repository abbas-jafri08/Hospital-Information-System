import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await Appointment.find();
  res.json(data);
});

router.post("/", async (req, res) => {
  const newData = new Appointment(req.body);
  await newData.save();
  res.json(newData);
});

router.put("/:id", async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;