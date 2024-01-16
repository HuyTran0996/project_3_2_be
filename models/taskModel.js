const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A task must have a name"],
    // Before running validators, Mongoose tries to convert or "cast" values to the correct type. This process is called "casting the document". If casting fails for a given path, the error.errors object will contain a CastError object. Casting runs before validation, and validation does not run if casting fails.
    // In this case, even though you've defined name as a string in your schema, Mongoose successfully casts the numeric value to a string before running the validators. That's why your custom validator doesn't prevent the creation of a task with a numeric name.
    // To solve this, you could use a custom setter for the name field in your schema. A setter is a function that Mongoose calls whenever you set the value of a path. A setter function runs before type casting. So when you use a setter, Mongoose first calls the setter function with the raw incoming value. If the setter throws an error, Mongoose stops further processing and doesn't save the document.
    set: function (v) {
      if (typeof v !== "string") {
        throw new Error("Name must be a string (schema)");
      }
      return v;
    },
  },
  description: {
    type: String,
    required: [true, "A task must have a description"],
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "working", "review", "done", "archive"],
      message:
        'status is either: "pending", "working", "review", "done", "archive"',
    },
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
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
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
    select: "-__v -task -isDeleted -deletedAt",
  });

  next();
});
taskSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
