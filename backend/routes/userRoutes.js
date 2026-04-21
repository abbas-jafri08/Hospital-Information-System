import express from "express";
import User from "../models/User.js";  // ✅ correct name + file

const router = express.Router();

// GET
router.get("/", async (req, res) => {
  const data = await User.find();
  res.json(data);
});

// POST
router.post("/", async (req, res) => {
  const newData = new User(req.body);
  await newData.save();
  res.json(newData);
});

// PUT
router.put("/:id", async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;