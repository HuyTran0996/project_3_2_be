const express = require("express");
const userControllers = require("../controllers/userController");

const router = express.Router();

router
  .route("/")
  .get(userControllers.getUsers)
  .post(userControllers.createUser);

router
  .route("/:id")
  .get(userControllers.getUserById)
  .put(userControllers.editUser)
  .delete(userControllers.deleteUser);

module.exports = router;
