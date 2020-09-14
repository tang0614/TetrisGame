const express = require("express");
const path = require("path");
const http = require("http");

const app = express();

app.use(express.static("public"));

app.get("/", function (req, res) {
  const index = path.join(__dirname, "index.html");

  res.sendFile(index);
});

const port = process.env.PORT || 5000; // Use the port that Heroku provides or default to 5000
app.set("port", port);
const server = http.createServer(app);

server.listen(port, function () {
  console.log(`Listening on ${port}`);
});
