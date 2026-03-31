const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/crowdDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Schema
const crowdSchema = new mongoose.Schema({
  place: String,
  status: String
});

const Crowd = mongoose.model("Crowd", crowdSchema);

// ADD DATA
app.post("/add", async (req, res) => {
  const { place, status } = req.body;

  const newData = new Crowd({ place, status });
  await newData.save();

  res.json({ message: "Data added" });
});

// GET DATA
app.get("/data", async (req, res) => {
  const data = await Crowd.find();
  res.json(data);
});

// DELETE DATA
app.delete("/delete/:id", async (req, res) => {
  try {
    await Crowd.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE DATA
app.put("/update/:id", async (req, res) => {
  try {
    const { status } = req.body;

    await Crowd.findByIdAndUpdate(req.params.id, { status });

    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SERVER START
app.listen(5000, () => {
  console.log("Server running on port 5000");
});