import express from "express";
import Doctor from "../models/Doctor.js";  // ✅ correct

const router = express.Router();

// GET
router.get("/", async (req, res) => {
  const data = await Doctor.find();
  res.json(data);
});

// POST
router.post("/", async (req, res) => {
  const newData = new Doctor(req.body);
  await newData.save();
  res.json(newData);
});

// PUT
router.put("/:id", async (req, res) => {
  const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;