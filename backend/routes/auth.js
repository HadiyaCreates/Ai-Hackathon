const express = require("express");
const router = express.Router();

const User = require("../models/User");


router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

  
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      email,
      password,
      name,
      role,
      points: 0
    });

    await user.save();

    res.json({
      message: "User created",
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;