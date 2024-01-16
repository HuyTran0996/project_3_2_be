const Task = require("../models/taskModel");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");

const getTasks = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Task.find(), req.query).filter().paginate();
  const tasks = await features.query;
  const totalTasks = await Task.find();
  const totalPages = Math.ceil(totalTasks.length / 10);

  res.status(200).json({
    message: "Get Task List Successfully!",
    data: {
      tasks,
      totalTasks: totalTasks.length,
      totalPage: totalPages,
      page: req.query.page,
    },
  });
});

const getTaskById = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError("No task found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

const createTask = catchAsync(async (req, res, next) => {
  //using express-validator, cái express-validator sẽ chạy và bắt lỗi trước cái check của schema
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  /////
  const newTask = await Task.create(req.body);

  //update User collection
  const assignorIds = req.body.assignor;
  const assigneeIds = req.body.assignee;

  await Promise.all([
    User.updateMany(
      { _id: { $in: assignorIds } },
      { $push: { task: newTask._id } }
    ),
    User.updateMany(
      { _id: { $in: assigneeIds } },
      { $push: { task: newTask._id } }
    ),
  ]);
  ////

  res.status(201).json({
    message: "Create Task Successfully!",
    user: newTask,
  });
});

const editTask = catchAsync(async (req, res, next) => {
  //using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  ////
  const oldTask = await Task.findById(req.params.id);

  if (!oldTask) {
    return next(new AppError("No task found with that ID", 404));
  }

  if (oldTask.status === "done" && req.body.status !== "archive") {
    return next(
      new AppError(
        " when the status is set to done, it can't be changed to other value except archive",
        400
      )
    );
  }

  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  //update User collection
  const assignorIds = task.assignor;
  const assigneeIds = task.assignee;

  await Promise.all([
    User.updateMany(
      { _id: { $in: assignorIds } },
      { $push: { task: task._id } }
    ),
    User.updateMany(
      { _id: { $in: assigneeIds } },
      { $push: { task: task._id } }
    ),
  ]);
  ///////////

  res.status(200).json({
    message: "Update Task Successfully!",
    task,
  });
});

const deleteTask = catchAsync(async (req, res, next) => {
  // const task = await Task.findByIdAndDelete(req.params.id);
  const task = await Task.findById(req.params.id);
  if (!task) {
    return next(new AppError("No task found with that ID", 404));
  }
  task.isDeleted = true;
  task.deletedAt = Date.now();
  await task.save();
  //update User collection
  await Promise.all([
    User.updateMany({ task: task._id }, { $pull: { task: task._id } }),
  ]);
  //{ $pull: { task: task._id } }: This is the update operation. $pull is a MongoDB operator that removes all instances of a value from an existing array. In this case, it's removing the _id of the task that's being deleted from the task array of the users who had that task assigned to them.

  res.status(202).json({
    message: "Delete Task Successfully!",
    data: null,
  });
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  editTask,
  deleteTask,
};
