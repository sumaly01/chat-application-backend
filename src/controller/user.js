const userSchema = require("../models/user");
const { sendWelcomeEmail } = require("../emails/account");

const userController = {};

userController.createUsers = async (req, res) => {
  try {
    const user = new userSchema(req.body);
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
};

userController.loginUser = async (req, res) => {
  try {
    const user = await userSchema.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken(); //small u
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: "Incorrect information" });
  }
};

userController.logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ message: "User has successfully logged out" });
  } catch (e) {
    res.status(500).send(e);
  }
};

userController.logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("Successfully logged out from all the devices");
  } catch (e) {
    res.status(500).send();
  }
};

userController.getSelf = async (req, res) => {
  res.send(req.user);
};

userController.getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find({ _id: { $nin: req.user._id } });
    res.send(users);
  } catch (e) {
    res.status(400).send({ e: "Unable to fetch users" });
  }
};

userController.updateUsers = async (req, res) => {
  //array of strings
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }
  try {
    //for middleware since findByIdAndUpdate le bypass grcha middleware lai
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports = userController;
