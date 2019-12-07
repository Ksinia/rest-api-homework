const express = require("express");
const bodyparser = require("body-parser");

const app = express();
port = 3000;
app.listen(port, () => console.log(`Listening on ${port}`));

const bodyparserMiddleware = bodyparser();
app.use(bodyparserMiddleware);

let count = 0;

app.post("/messages", (req, res) => {
  if (count == 5) {
    res.status(429).send();
  } else {
    if (!req.body.text) {
      res.status(400).send();
    } else {
      count += 1;
      console.log(req.body.text);
      res.send({
        message: "Message received loud and clear"
      });
    }
  }
});
