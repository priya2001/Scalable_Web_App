const Note = require("../models/Note");

// Get all notes for the authenticated user
exports.getAllNotes = async (req, res) => {
  try {
    const { search, sortBy = 'createdAt', sortOrder = 'desc', limit = 10, page = 1 } = req.query;
    const userId = req.userId;

    // Build filter object
    let filter = { userId };
    
    // Add search functionality if search term is provided
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const notes = await Note.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const total = await Note.countDocuments(filter);

    res.json({
      notes,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: "Server error while fetching notes" });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Note.create({ 
      title, 
      content, 
      userId 
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: "Server error while creating note" });
  }
};

// Get a single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note by ID error:', error);
    res.status(500).json({ message: "Server error while fetching note" });
  }
};

// Update a note by ID
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Note.findOneAndUpdate(
      { _id: id, userId }, 
      { title, content },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: "Server error while updating note" });
  }
};

// Delete a note by ID
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const note = await Note.findOneAndDelete({ _id: id, userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: "Server error while deleting note" });
  }
};