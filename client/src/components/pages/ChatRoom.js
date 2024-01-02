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

  // 세션 기능 확인 후, 수정 예정 코드
  const [memberId, setMemberId] = useState("")

  const [boardInfo, setBoardInfo] = useState({});
  const [userId, setUserId] = useState("");
  const [userDo, setUserDo] = useState("");
  

  const [msgInput, setMsgInput] = useState("");
  const [chatList, setChatList] = useState([]);


  const initSocketConnect = () => {
    console.log("connected", socket.connected);
    if (!socket.connected) socket.connect();
  };

  const getBoardInfo = async() => {
    try {
      const response = await axios.get(
        `http://localhost:8000/chatRoom/:id/getBoardInfo?roomId=${id}`,
      );

      // console.log("여기여기", response.data)
      if (memberId == response.data.sellerMemberId) {
        setUserDo("판매");
        console.log("판매자입니다.")
      } else if (memberId == response.data.buyerMemberId) {
        setUserDo("구매");
        console.log("구매자입니다.")
      } else {
        console.log("잘못된 접근입니다.");
        return;
      }

      setBoardInfo({
        sellerMemberId: response.data.sellerMemberId,
        buyerMemberId: response.data.buyerMemberId,
        image: response.data.image,
        price: response.data.price,
        starAvg: response.data.starAvg,
        title: response.data.title,
      })
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const entryChat = () => {
    initSocketConnect();
    socket.emit("entry", { userId: memberId });
    getBoardInfo()
  };

  const sendMsg = () => {
    // initSocketConnect();
    if (msgInput !== "") {
      socket.emit("sendMsg", { userId: userId, msg: msgInput });
      setMsgInput("");
    }
  };

  const addChatList = useCallback(
    (res) => {
      const nickname = "nickname";
      const type = res.userId === userId ? "my" : "other";
      const content = `${res.msg}`
      const newChatList = [
        ...chatList,
        { nickname: nickname, type: type, content: content },
      ];
      setChatList(newChatList);

      const chatData = {
        roomId: id,
        type: type,
        nickname: nickname,
        chatText: content,
      };

      const postChat = async() => {
        console.log(chatData);
        try {
          const response = await axios.post(
            `http://localhost:8000/chatRoom/:id/postChat`,
          chatData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
    
            console.log(response.data);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      postChat();
    },
    [userId, chatList]
  );

  

  // useEffect(() => {
  //   getBoardInfo();
  // }, [userDo])

  useEffect(() => {
    // getBoardInfo();

    socket.on("error", (res) => {
      alert(res.msg);
    });

    socket.on("entrySuccess", (res) => {
      setUserId(res.userId);
    });
  }, []);

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

  return (
    <>
      <div className="input-container">
        <input
          type="text"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        />
        <button onClick={entryChat}>입장</button>
      </div>
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

          <button>{userDo} 확정</button>
          <button>{userDo} 취소</button>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
          />
          <button onClick={sendMsg}>전송</button>
        </div>
      </div>
    </>
  );
}
