const http = require("http");
const express = require("express");
const app = express();
const PORT = 8000;
const server = http.createServer(app);
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

// SB: socket 연결시 실행되는 socket 함수입니다.
io.on("connection", (socket) => {

  // SB: 채팅방에 들어가면 실행되는 함수입니다.
  socket.on("entry", (res) => {
    
    // 같은 socket.id로 roomArr에 채팅방 정보가 없다면 그대로 배열을 비워두고,
    // 같은 socket.id로 roomArr에 채팅방 정보가 있다면(사용자가 다른 room에 들어간 상태라면)
    // 해당하는 room에서 나오게 합니다.
    if (!roomArr[socket.id]) {
      roomArr[socket.id] = [];
    } else {
      socket.leave(roomArr[socket.id][0]);
      roomArr[socket.id] = [];
    }

    // 사용자를 res.roomName라는 이름의 room에 들어가게 합니다.
    socket.join(res.roomName);

    // 사용자를 포함한 room에 있는 모두에게 공지 메세지를 전달합니다.
    io.to(res.roomName).emit("notice", { msg: `${res.userDo}자님이 입장하셨습니다.` });

    // 사용자 정보(구매자 or 판매자)와 채팅방 정보를 socket.id와 함께 저장합니다.
    userDoArr[socket.id] = res.userDo;
    roomArr[socket.id].push(res.roomName);
  });

  // SB: sendMsg로 메세지를 받으면 사용자를 포함한 room에 있는 모두에게 메세지를 전달합니다.
  socket.on("sendMsg", (res) => {
    io.to(res.roomName).emit("chat", { memberId: res.memberId, msg: res.msg });
  });

  // SB: sendNotice로 구매 관련 공지를 받으면 사용자를 포함한 room에 있는 모두에게 전달합니다.
  socket.on("sendNotice", (res) => {
    io.to(res.roomName).emit("transactionNotice", { memberId: res.memberId, msg: res.msg });
  });

  // SB: sell로 판매자 정보(memberId, 계좌 정보)를 받아, 다른 사용자에게도 보냅니다.
  socket.on("sell", (res) => {
    io.emit("sellConfirmed", { memberId: res.memberId , bankName: res.bankName, accountNum: res.accountNum });
  });

  // SB: stateGive로 채팅방 구매 현황 상태를 받아, 다른 사용자에게도 보냅니다.
  socket.on("stateGive", (res) => {
    io.emit("stateReceive", { chatState: res.chatState });
  });

  // SB: fileGive로 판매자가 보낸 파일 url을 받아, 다른 사용자에게도 fileReceive로 보냅니다.
  socket.on("fileGive", (res) => {
    io.emit("fileReceive", { imagePath: res.imagePath });
  });

  // SB: socket 연결이 해제되면(다른 채팅방을 들어가거나, 뒤로가기 버튼을 누를 경우)
  // 사용자를 포함한 room에 있는 모두에게 퇴장 공지를 전달합니다.
  socket.on("disconnection", (res) => {
    socket.leave(res.roomName);
    io.to(res.roomName).emit("notice", { msg: `${res.userDo}자님이 퇴장하셨습니다.` });
    delete userDoArr[socket.id];
  });

  // SB: socket 연결이 해제되면(브라우저를 나갈 경우) 사용자를 포함한 room에 있는 모두에게 퇴장 공지를 전달합니다.
  socket.on("disconnect", () => {
    io.to(roomArr[socket.id]).emit("notice", { msg: `${userDoArr[socket.id]}자님이 퇴장하셨습니다.` });
    delete userDoArr[socket.id];
  });
});

server.listen(PORT, function () {
  console.log(`Sever Open: ${PORT}`);
});
