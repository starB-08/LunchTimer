const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;
const dataPath = path.join(__dirname, "data", "data.json");

io.on("connection", (socket) => {
  console.log("viewer connected:", socket.id);
  socket.emit("nowClass", nowClass);
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/frontend/viewer.html");
});

app.get("/viewer", (req, res) => {
  res.sendFile(__dirname + "/frontend/viewer.html");
});

app.get("/control", (req, res) => {
  res.sendFile(__dirname + "/frontend/control.html");
});

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/frontend/admin.html");
});

app.get("/nextClass/:i", (req, res) => {
  const i = Number(req.params.i);
  nowClass[i] += 1;
  if (nowClass[i] > maxClass[i]) nowClass[i] = 1;
  io.emit("nowClass", nowClass);
  io.emit("flicker", i);
  res.send(nowClass);
});

app.get("/getClass", (req, res) => {
  res.send(nowClass);
});

app.get("/read", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    try {
      _data = JSON.parse(data);
      nowClass = _data.firstClass;
      maxClass = _data.classAmount;
      res.json(_data);
    } catch (parseErr) {
      console.error("JSON 파싱 오류:", parseErr);
      res.status(500).json({ error: "JSON 형식이 잘못되었습니다." });
    }
  });
});

app.get("/write/:v", (req, res) => {
  const value = req.params.v;
  console.log(value);
  fs.writeFile(dataPath, value, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});

app.get("/getMaxClass", (req, res) => {
  res.send(maxClass);
});

app.get("/playSound", (req, res) => {
  io.emit("playSound", 0);
  res.send("DONE!");
});

server.listen(port, () => {
  console.log(`server is listening at localhost:${port}`);
  fetch("http://localhost:3000/read");
});

//----------------------------------------------------------//

let _data = JSON.parse('{ "classAmount": [10,10,13], "firstClass": [1,1,1] }');
let nowClass = [1, 1, 1];
let maxClass = [10, 10, 13];
