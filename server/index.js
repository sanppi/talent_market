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


const userDoArr = {};
const roomArr = {};

// 리더님 코드가 전체적으로 좀 늦게 실행되는 느낌이에요...
io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event:${event}`);
  });

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

  socket.on("sendMsg", (res) => {
    io.to(res.roomName).emit("chat", { memberId: res.memberId, msg: res.msg });
  });

  socket.on("sell", (res) => {
    socket.emit("sellConfirmed", { memberId: res.memberId , bankName: res.bankName, accountNum: res.accountNum });
  });

  socket.on("canBuy", (res) => {
    io.emit("buy", { chatState: res.chatState });
  });

  socket.on("done", (res) => {
    io.emit("check", { chatState: res.chatState });
  });



  // socket.on('Start', function (data) {
  //   console.log('socket start!!');
  //   console.log(data);
  //   var Name = data.Name;
  //   Files[Name] = {
  //     FileSize : data.Size,
  //     Data : "",
  //     Downloaded : 0
  //   };
  //   var Place = 0;
  //   var Stat = fs.statSync('Temp/' + Name);
  //   if ( Stat.isFile() ) {
  //     Files[Name].Downloaded = Stat.size;
  //     Place = Stat.size / 524288;
  //   }
  //   fs.open("Temp/" + Name, "a+", function (err, fd) {
  //     if (err) console.log(err);
  //     else {
  //       Files[Name].Handler = fd;
  //       socket.emit('MoreData', { 'Place' : Place, Percent : 0 });
  //     }
  //   });
  // });
  



  socket.on("disconnection", (res) => {
    socket.leave(res.roomName);
    io.to(res.roomName).emit("notice", { msg: `${res.userDo}자님이 퇴장하셨습니다.` });
    delete userDoArr[socket.id];
  });
  
  socket.on("disconnect", () => {
    io.to(roomArr[socket.id]).emit("notice", { msg: `${userDoArr[socket.id]}자님이 퇴장하셨습니다.` });
    delete userDoArr[socket.id];
  });
});

server.listen(PORT, function () {
  console.log(`Sever Open: ${PORT}`);
});
