const express = require("express");
const router = express.Router();
const { getAllNotes, createNote, getNoteById, updateNote, deleteNote } = require("../controllers/noteController");
const auth = require("../middleware/authMiddleware");

// GET /api/notes - Get all notes for the authenticated user
router.get("/", auth, getAllNotes);

// POST /api/notes - Create a new note
router.post("/", auth, createNote);

// GET /api/notes/:id - Get a specific note by ID
router.get("/:id", auth, getNoteById);

// PUT /api/notes/:id - Update a specific note by ID
router.put("/:id", auth, updateNote);

// DELETE /api/notes/:id - Delete a specific note by ID
router.delete("/:id", auth, deleteNote);

module.exports = router;
