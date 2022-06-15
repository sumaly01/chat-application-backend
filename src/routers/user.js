const express = require("express");
const authentication = require("../middleware/authentication");
const userController = require("../controller/user");
const router = new express.Router();

//route for creating user
router.post("/users", userController.createUsers);

//route for user login
router.post("/users/login", userController.loginUser);

//route for user logout
router.post("/users/logout", authentication, userController.logoutUser);

//route for all account logout
router.post("/users/logoutAll", authentication, userController.logoutAll);

//route for accessing my profile
router.get("/users/me", authentication, userController.getSelf);

//route for getting users besides me
router.get("/users", authentication, userController.getAllUsers);

//route for updating user
router.patch("/users/me", authentication, userController.updateUsers);

module.exports = router;
