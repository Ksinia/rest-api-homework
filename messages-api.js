const express = require("express");
const bodyparser = require("body-parser");
const middleware = require("./middleware");

const app = express();
port = 3000;
app.listen(port, () => console.log(`Listening on ${port}`));

const bodyparserMiddleware = bodyparser();
app.use(bodyparserMiddleware);
// app.use(middleware);

app.post("/messages", middleware, (req, res) => {
  if (!req.body.text) {
    res.status(400).send();
  } else {
    console.log(req.body.text);
    res.send({
      message: "Message received loud and clear"
    });
  }
});
