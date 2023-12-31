import "../../styles/chat.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Chat from "./Chat";
import Notice from "./Notice";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8000", { autoConnect: false });

export default function ChatRoom() {
  const { id } = useParams();

  const [boardInfo, setBoardInfo] = useState({});
  const [userId, setUserId] = useState("null");

  const [msgInput, setMsgInput] = useState("");
  const [userIdInput, setUserIdInput] = useState("");
  const [chatList, setChatList] = useState([]);

  const [userList, setUserList] = useState({});
  const [dmTo, setDmTo] = useState('all');

  useEffect(() => {
    console.log("id", id);
  }, []);

  const initSocketConnect = () => {
    console.log("connected", socket.connected);
    if (!socket.connected) socket.connect();
  };

  useEffect( async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/chatRoom/:id/getBoardInfo?roomId=${id}`,
      );  
      setBoardInfo({
        image: response.data.image,
        nickname : response.data.nickname,
        price: response.data.price,
        starAvg: response.data.starAvg,
        title: response.data.title,
      })
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  useEffect(() => {
    console.log("boardInfo", boardInfo);
  }, [boardInfo]);


  useEffect(() => {
    socket.on("error", (res) => {
      alert(res.msg);
    });

    socket.on("entrySuccess", (res) => {
      setUserId(res.userId);
    });

    socket.on("userList", (res) => {
      setUserList(res);
    })
  }, []);

  const userListOptions = useMemo(() => {
    const options = [];
    for(const key in userList) {
      if (userList[key] === userId) continue;
      options.push(<option key={key} value={key}>{userList[key]}</option>)
    }
    return options
  }, [userList])

  const addChatList = useCallback(
    (res) => {
      const type = res.userId === userId ? "my" : "other";
      const content = `${res.msg}`
      const newChatList = [
        ...chatList,
        { type: type, content: content },
      ];
      setChatList(newChatList);
    },
    [userId, chatList]
  );

  useEffect(() => {
    socket.on("chat", addChatList);
    return () => socket.off("chat", addChatList);
  }, [addChatList])
  



  useEffect(() => {
    const notice = (res) => {
      const newChatList = [...chatList, { type: "notice", content: res.msg }];
      setChatList(newChatList);
    };

    socket.on("notice", notice);
    return () => socket.off("notice", notice);
  }, [chatList]);

  const sendMsg = () => {
    // initSocketConnect();
    if (msgInput !== "") {
      socket.emit("sendMsg", { userId: userId, msg: msgInput, dm: dmTo });
      setMsgInput("");
    }
  };

  const entryChat = () => {
    initSocketConnect();
    socket.emit("entry", { userId: userIdInput });
  };

  return (
    <>
      <div class="container text-center" style={{ backgroundColor: 'lightyellow', marginBottom: '10px' }}>
        <div class="row">
          <div class="col">
          {boardInfo.image}
          </div>
          <div class="col-6">
            <div>{boardInfo.title}</div>
            <div>{boardInfo.price}</div>
            <div>{boardInfo.starAvg}</div>
          </div>
          <div class="col">
            <div>{boardInfo.nickname}</div>
            <div>판매자설명</div>
          </div>
        </div>
        <div className="chat-container">

          {chatList.map((chat, i) => {
            if (chat.type === "notice") return <Notice key={i} chat={chat} />;
            else return <Chat key={i} chat={chat} />;
          })}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
          />
          <button onClick={sendMsg}>전송</button>
        </div>
        <div className="input-container">
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
            />
            <button onClick={entryChat}>입장</button>
          </div>
      </div>
    </>
  );
}
