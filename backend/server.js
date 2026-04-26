
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  });

// ================= MODELS =================
const User = require("./models/User");
const Task = require("./models/Task");
const Submission = require("./models/Submission");

// ================= ROUTES =================

// 🔹 USER STATS
app.get("/user/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const submissions = await Submission.find({ userId });

    const approved = submissions.filter(s => s.status === "approved");
    const pending = submissions.filter(s => s.status === "pending");

    // Weekly points logic
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyApproved = approved.filter(s => s.createdAt >= oneWeekAgo);

    res.json({
      points: user.points,
      activeTasks: await Task.countDocuments(),
      openSubmissions: pending.length,
      weeklyPoints: weeklyApproved.reduce((sum, s) => sum + s.points, 0)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get("/tasks/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.params.userId
    });

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.post("/tasks", async (req, res) => {
  try {
    const { title, description, points, deadline, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      points,
      deadline,
      assignedTo // 🔥 NEW
    });

    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 🔹 SUBMIT TASK
app.post("/submit", async (req, res) => {
  try {
    const { userId, taskId, proof } = req.body;

    if (!userId || !taskId || !proof) {
      return res.status(400).json({ message: "All fields required" });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // prevent duplicate
    const existing = await Submission.findOne({ userId, taskId });
    if (existing) {
      return res.status(400).json({ message: "Already submitted" });
    }

    const submission = new Submission({
      userId,
      taskId,
      proof,
      status: "pending",
      points: task.points
    });

    await submission.save();

    res.json({ message: "✅ Submitted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 USER SUBMISSIONS
app.get("/submissions/:userId", async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.params.userId })
      .populate("taskId");

    res.json(submissions);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/admin/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("userId")
      .populate("taskId");

    console.log("ALL SUBMISSIONS:", submissions); // 🔥 DEBUG

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 GET ALL USERS (ADMIN)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "✅ User deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = new User({
      name,
      email,
      password,
      role,
      points: 0
    });

    await user.save();

    res.json({ message: "User created", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 🔹 LEADERBOARD
app.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 APPROVE SUBMISSION (Admin)
app.patch("/approve/:id", async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.status !== "approved") {
      submission.status = "approved";
      await submission.save();

      await User.findByIdAndUpdate(submission.userId, {
        $inc: { points: submission.points }
      });
    }

    res.json({ message: "✅ Submission approved" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});