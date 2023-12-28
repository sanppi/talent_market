const http = require("http");
const express = require("express");
const app = express();
const PORT = 8000;
const server = http.createServer(app);
const multer = require("multer");
const path = require("path");

const { Member } = require("./model");
const { Board } = require("./model");
const { Comment } = require("./model");

const cors = require("cors");
const { emit } = require("process");
app.use(cors());

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.set("view engine", "ejs");
app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = require("./routes");
app.use("/", router);

const boardRouter = require('./routes/board');
app.use('/board', boardRouter);

app.get('/', (req,res) => {
  res.send({message:'server client connections'});
});

app.get("*", function (req, res) {
  res.send("404");
});





const userIdArr = {};

const updateUserList = () => {
  io.emit("userList", userIdArr)
}

io.on("connection", (socket) => {
  updateUserList();
  console.log("socket id", socket.id);

  socket.on("entry", (res) => {
    if (Object.values(userIdArr).includes(res.userId)) {
      socket.emit("error", {
        msg: "중복된 아이디가 존재하여 입장이 불가합니다.",
      });
    } else {
      io.emit("notice", { msg: `${res.userId}님이 입장하셨습니다.` });
      socket.emit("entrySuccess", { userId: res.userId });
      userIdArr[socket.id] = res.userId;
    }
    console.log(userIdArr);
  });

  socket.on("disconnect", () => {
    io.emit("notice", { msg: `${userIdArr[socket.id]}님이 퇴장하셨습니다.` });
    delete userIdArr[socket.id];
    console.log(userIdArr);
    updateUserList();
  });

  socket.on("sendMsg", (res) => {
    if (res.dm === "all") io.emit("chat", { userId: res.userId, msg: res.msg })
    else {
      io.to(res.dm).emit("chat", { userId: res.userId, msg: res.msg, dm: true })
      socket.emit("chat", { userId: res.userId, msg: res.msg, dm: true })
    }
  });
});





server.listen(PORT, function () {
  console.log(`Sever Open: ${PORT}`);
});
