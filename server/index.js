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



const userIdArr = {};

const updateUserList = () => {
  io.emit("userList", userIdArr)
}

io.on("connection", (socket) => {
  updateUserList();
  socket.on("entry", (res) => {
    io.emit("notice", { memberId: res.memberId});
    // socket.emit("entrySuccess", { memberId: res.memberId });
    userIdArr[socket.id] = res.memberId;
  });

  socket.on("disconnect", () => {
    io.emit("notice", { msg: `${userIdArr[socket.id]}님이 퇴장하셨습니다.` });
    delete userIdArr[socket.id];
    // console.log(userIdArr);
    updateUserList();
  });

  socket.on("sendMsg", (res) => {
    io.emit("chat", { memberId: res.memberId, msg: res.msg })
  });
});

server.listen(PORT, function () {
  console.log(`Sever Open: ${PORT}`);
});
