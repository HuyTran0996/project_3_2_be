const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    unique: true,
  },
  role: {
    type: String,
    enum: {
      values: ["manager", "employee"],
      message: 'role is either: "manager", "employee"',
    },
    required: [true, "A user must have a role"],
    default: "employee",
  },
  task: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "task",
    select: "-__v",
  });

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
