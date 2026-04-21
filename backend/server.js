import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import patientRoutes from "./routes/patientRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/patients", patientRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Hospital API Running");
});

// Test DB route
app.get("/api/test-db", async (req, res) => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    res.json({
      message: "DB Working ✅",
      collections,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err.message));

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});