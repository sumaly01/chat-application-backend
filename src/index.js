const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const messageRouter = require("./routers/message");

const app = express();
const port = process.env.PORT;

//parse json object to js object
app.use(express.json());
app.use(userRouter);
app.use(messageRouter);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).end("ERROR : Please authenticate");
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
