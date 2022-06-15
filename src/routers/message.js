const express = require("express");
const authentication = require("../middleware/authentication");
const messageController = require("../controller/message");
const router = new express.Router();

//route for creating messages
router.post("/messages", authentication, messageController.createMessages);

//route for get message
router.get("/messages", authentication, messageController.getMessages);

//route for update messages
router.patch("/messages", authentication, messageController.updateMessages);

//route for delete message
router.delete("/messages", authentication, messageController.deleteMessages);

module.exports = router;
