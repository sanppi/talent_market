const http = require("http");
const express = require("express");
const app = express();
const PORT = 8000;
const server = http.createServer(app);
const multer = require("multer");
const path = require("path");
const session = require("express-session");

const cors = require("cors");
app.use(cors({origin: true, credentials: true}));

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// 로그인 세션
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const router = require("./routes");
app.use("/", router);

const boardRouter = require("./routes/board");
app.use("/product", boardRouter);

const commentRouter = require("./routes/comment");
app.use("/review", commentRouter);

const chattingRouter = require("./routes/chatting");
app.use("/chatting", chattingRouter);

const chatRoomRouter = require("./routes/chatRoom");
app.use("/chatRoom", chatRoomRouter);

const memberRouter = require("./routes/member");
app.use("/member", memberRouter);

app.get("/", (req, res) => {
  res.send({ message: "server client connections" });
});

app.get("*", function (req, res) {
  res.send("404");
});



io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event:${event}`);
  });

  socket.on("entry", (res) => {
    socket.join(res.roomName);
    console.log("socket.rooms", socket.rooms);
    io.to(res.roomName).emit("notice", { msg: `${res.userDo}님이 입장하셨습니다.` });
  });

  socket.on("disconnect", (res) => {
    socket.leave(res.roomName);
    io.to(res.roomName).emit("notice", { msg: `${res.userDo}님이 퇴장하셨습니다.` });
    console.log("socket.rooms", socket.rooms);
    // socket.rooms.forEach((room) => socket.to)
  });

  socket.on("sendMsg", (res) => {
    io.to(res.roomName).emit("chat", { memberId: res.memberId, msg: res.msg });
  });
});

server.listen(PORT, function () {
  console.log(`Sever Open: ${PORT}`);
});
