const User = require("../models/userModel");
const Task = require("../models/taskModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query).filter().paginate();
  const users = await features.query;
  const totalUsers = await User.find();
  const totalPages = Math.ceil(totalUsers.length / 10);

  res.status(200).json({
    message: "Get User List Successfully!",
    data: {
      users,
      totalUsers: totalUsers.length,
      totalPage: totalPages,
      page: req.query.page,
    },
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  //update Task collection
  const taskIds = req.body.task;
  const role = req.body.role;
  await Promise.all([
    Task.updateMany(
      { _id: { $in: taskIds } },
      { $push: { [`${role}`]: newUser._id } }
    ),
  ]);
  ///

  res.status(201).json({
    message: "Create User Successfully!",
    user: newUser,
  });
});

const editUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  //update Task collection

  const role = user.role;
  await Promise.all([
    Task.updateMany(
      { _id: { $in: taskIds } },
      { $push: { [`${role}`]: user._id } }
    ),
  ]);
  ////

  res.status(200).json({
    message: "Update User Successfully!",
    user,
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  //update Task collection
  await Promise.all([
    Task.updateMany({ role: user._id }, { $pull: { role: user._id } }),
  ]);
  /////

  res.status(204).json({
    message: "Delete User Successfully!",
    data: null,
  });
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editUser,
  deleteUser,
};
