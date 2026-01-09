const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  const note = await Note.create({ ...req.body, userId: req.userId });
  res.json(note);
});

router.get("/", auth, async (req, res) => {
  const notes = await Note.find({ userId: req.userId });
  res.json(notes);
});

router.delete("/:id", auth, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
