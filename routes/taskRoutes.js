const express = require("express");
const taskControllers = require("../controllers/taskController");
const { check } = require("express-validator");

const router = express.Router();

const validateTaskInput = [
  check("name").exists().withMessage("name is required"),
  check("name").isString().withMessage("name must be a string"),
  check("description").exists().withMessage("description is required"),
  check("description").isString().withMessage("description must be a string"),
  check("status").exists().withMessage("status is required"),
  check("status")
    .isIn(["pending", "working", "review", "done", "archive"])
    .withMessage("Invalid status"),
  check("assignor").exists().withMessage("assignor is required"),
  check("assignor").isArray().withMessage("assignor must be an array"),
  check("assignor.*")
    .isMongoId()
    .withMessage("Each assignor must be a valid MongoDB ObjectID"),
  check("assignee").exists().withMessage("assignee is required"),
  check("assignee").isArray().withMessage("assignee must be an array"),
  check("assignee.*")
    .isMongoId()
    .withMessage("Each assignee must be a valid MongoDB ObjectID"),
];

router.route("/").get(taskControllers.getTasks);
router.route("/").post(validateTaskInput, taskControllers.createTask);

router.route("/:id").get(taskControllers.getTaskById);
router.route("/:id").put(validateTaskInput, taskControllers.editTask);
router.route("/:id").delete(taskControllers.deleteTask);

module.exports = router;
