const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A task must have a name"],
  },
  description: {
    type: String,
    required: [true, "A task must have a description"],
  },
  status: {
    type: String,
    enum: ["pending", "working", "review", "done", "archive"],
    required: [true, "A task must have a status"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  assignor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  assignee: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: "assignor assignee",
    select: "-__v -task",
  });

  next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
