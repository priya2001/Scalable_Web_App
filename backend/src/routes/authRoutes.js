const express = require("express");
const router = express.Router();
const { signup, login, getProfile, updateProfile } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);

// Protected profile routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

module.exports = router;
