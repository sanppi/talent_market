const http = require("http");
const express = require("express");
const app = express();
const PORT = 8000;
const server = http.createServer(app);
const multer = require("multer");
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


// SB: 
const userDoArr = {};
const roomArr = {};

// SB: 소켓 연결시 실행되는 함수입니다.
io.on("connection", (socket) => {

  // SB: 소켓 연결시 실행되는 함수입니다.
  socket.on("entry", (res) => {
    if (!roomArr[socket.id]) {
      roomArr[socket.id] = [];
    } else {
      socket.leave(roomArr[socket.id][0]);
      roomArr[socket.id] = [];
    }
    socket.join(res.roomName);
    io.to(res.roomName).emit("notice", { msg: `${res.userDo}자님이 입장하셨습니다.` });

    userDoArr[socket.id] = res.userDo;
    roomArr[socket.id].push(res.roomName);
  });

  // SB: 메세지를 보낼 때 실행되는 함수입니다.
  socket.on("sendMsg", (res) => {
    io.to(res.roomName).emit("chat", { memberId: res.memberId, msg: res.msg });
  });

  // SB: 소켓 연결시 실행되는 함수입니다.
  socket.on("sendNotice", (res) => {
    io.to(res.roomName).emit("transactionNotice", { memberId: res.memberId, msg: res.msg });
  });


  
  // SB: 소켓 연결시 실행되는 함수입니다.
  socket.on("sell", (res) => {
    io.emit("sellConfirmed", { memberId: res.memberId , bankName: res.bankName, accountNum: res.accountNum });
  });

  socket.on("stateGive", (res) => {
    io.emit("stateReceive", { chatState: res.chatState });
  });

  // SB: 소켓 연결시 실행되는 함수입니다.
  socket.on("fileGive", (res) => {
    io.emit("fileReceive", { imagePath: res.imagePath });
  });

  // SB: 소켓 연결시 실행되는 함수입니다.
  socket.on("disconnection", (res) => {
    socket.leave(res.roomName);
    io.to(res.roomName).emit("notice", { msg: `${res.userDo}자님이 퇴장하셨습니다.` });
    delete userDoArr[socket.id];
  });
  
  // SB: 소켓 연결시 실행되는 함수입니다.
  socket.on("disconnect", () => {
    io.to(roomArr[socket.id]).emit("notice", { msg: `${userDoArr[socket.id]}자님이 퇴장하셨습니다.` });
    delete userDoArr[socket.id];
  });
});

server.listen(PORT, function () {
  console.log(`Sever Open: ${PORT}`);
});
