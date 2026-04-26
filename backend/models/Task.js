// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   points: Number,
//   deadline: Date
// }, { timestamps: true });

// module.exports = mongoose.model("Task", taskSchema);
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  points: Number,
  deadline: Date,

  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);