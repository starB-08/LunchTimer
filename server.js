const express = require("express");
const app = express();
const port = process.env.PORT || 80;

const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.get("/viewer", (req, res) => {
  res.sendFile(__dirname + "/frontend/viewer/index.html");
});

app.get("/control", (req, res) => {
  res.sendFile(__dirname + "/frontend/index.html");
});

app.get("/sound/:name", (req, res) => {
  const { name } = req.params;
  if (name == "dog") {
    res.json({ sound: "멍멍" });
  } else if (name == "cat") {
    res.json({ sound: "야옹" });
  } else if (name == "pig") {
    res.json({ sound: "꿀꿀" });
  } else {
    res.json({ sound: name });
  }
});

app.listen(port, () => {
  console.log(`server is listening at localhost:${port}`);
});
