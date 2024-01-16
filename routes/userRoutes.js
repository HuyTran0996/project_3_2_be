const express = require("express");
const userControllers = require("../controllers/userController");

const router = express.Router();

router.route("/").get(userControllers.getUsers);
router.route("/").post(userControllers.createUser);

router.route("/:id").get(userControllers.getUserById);
router.route("/:id").put(userControllers.editUser);
router.route("/:id").delete(userControllers.deleteUser);

module.exports = router;
