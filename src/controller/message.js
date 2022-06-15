const messageSchema = require("../models/message");

const messageController = {};

messageController.createMessages = async (req, res) => {
  const message = new messageSchema({
    ...req.body,
    owner: req.user._id,
    anotherUser: req.query.userId,
  });

  try {
    await message.save();
    res.status(201).send(message);
  } catch (e) {
    res.status(400).send(e);
  }
};

messageController.getMessages = async (req, res) => {
  try {
    const bothMessage = await messageSchema
      .find({
        $or: [
          { anotherUser: req.user._id, owner: req.query.userId },
          { owner: req.user._id, anotherUser: req.query.userId },
        ],
      })
      .sort({ _id: 1 })
      .select({ description: 1 })
      .populate([
        {
          path: "owner",
          select: "name email",
        },
        {
          path: "anotherUser",
          select: "name email",
        },
      ]);
    if (bothMessage.length == 0) {
      res.status(404).send({
        message:
          "There is no conversation between the two users. Chat to start the conversation",
      });
    } else {
      res.send(bothMessage);
    }
  } catch (e) {
    res.status(500).send();
  }
};

messageController.updateMessages = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates" });
    }

    const message = await messageSchema.findOne({
      _id: req.query.id,
      owner: req.user._id,
      anotherUser: req.query.userId,
    });
    //    const message = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    if (!message) {
      return res.status(404).send({ error: "No message found" });
    }
    updates.forEach((update) => {
      message[update] = req.body[update];
    });
    message.save();
    res.send(message);
  } catch (e) {
    res.status(400).send(e);
  }
};

messageController.deleteMessages = async (req, res) => {
  try {
    const message = await messageSchema.findOneAndDelete({
      _id: req.query.id,
      owner: req.user._id,
      anotherUser: req.query.userId,
    });
    if (!message) {
      return res.status(404).send({ error: "No message found" });
    }
    res.send(message);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = messageController;
