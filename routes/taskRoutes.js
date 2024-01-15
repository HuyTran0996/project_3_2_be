const express = require("express");
const taskControllers = require("../controllers/taskController");

const router = express.Router();

router
  .route("/")
  .get(taskControllers.getTasks)
  .post(taskControllers.createTask);

router
  .route("/:id")
  .get(taskControllers.getTaskById)
  .put(taskControllers.editTask)
  .delete(taskControllers.deleteTask); //soft delete

module.exports = router;
