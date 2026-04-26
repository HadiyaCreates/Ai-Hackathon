const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  proof: String,
  status: String,
  points: Number
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);