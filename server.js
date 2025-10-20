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

io.on("connection", (socket) => {
  console.log("viewer connected:", socket.id);
  socket.emit("nowClass", classIndex);
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
  classIndex[i] += 1;
  if (classIndex[i] > maxClass[i]) classIndex[i] = 1;
  console.log(classIndex);
  nowClass[i] = (firstClass[i] + classIndex[i] - 1) % maxClass[i];
  if (nowClass[i] == 0) nowClass[i] = maxClass[i];

  io.emit("nowClass", classIndex);
  io.emit("flicker", i);
  res.send(nowClass);
});

app.get("/getClass", (req, res) => {
  for (var i = 0; i < 3; i++) {
    nowClass[i] = (firstClass[i] + classIndex[i] - 1) % maxClass[i];
    if (nowClass[i] == 0) nowClass[i] = maxClass[i];
  }
  res.send(nowClass);
});

app.get("/read", async (req, res) => {
  const response = await fetch(
    "https://port-0-lunchtimerdb-mgwvf8ly06fa2d51.sel3.cloudtype.app/read"
  );
  const data = await response.json();

  _data = data;
  firstClass = _data.firstClass;
  maxClass = _data.classAmount;

  console.log(`1: ${JSON.stringify(_data)} / ${firstClass} / ${maxClass}`);
});

app.get("/write/:v", (req, res) => {
  const value = req.params.v;
  console.log(value);
  fetch(
    `https://port-0-lunchtimerdb-mgwvf8ly06fa2d51.sel3.cloudtype.app/write/${value}`
  )
    .then((response) => response.json())
    .then((data) => {});
});

app.get("/getMaxClass", (req, res) => {
  res.json(JSON.parse(`{"max":[${maxClass}], "first":[${firstClass}]}`));
});

app.get("/playSound", (req, res) => {
  io.emit("playSound", 0);
  res.json("{'m':'DONE!'}");
});

app.get("/getIndex", (req, res) => {
  res.send(classIndex);
});

server.listen(port, () => {
  console.log(`server is listening at localhost:${port}`);
  fetch(`http://127.0.0.1:3000/read`)
    .then((response) => response.json())
    .then((data) => {
      //   console.log(data);
    });
});

//----------------------------------------------------------//

let _data = JSON.parse("{}");
let nowClass = [1, 1, 1];
let classIndex = [1, 1, 1];
let firstClass = [1, 1, 1];
let maxClass = [10, 10, 13];
