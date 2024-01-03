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
  // id -> roomId
  const [memberId, setMemberId] = useState(null);
  const [myNickname, setMyNickname] = useState(null);
  const [otherNickname, setOtherNickname] = useState(null);
  const [boardInfo, setBoardInfo] = useState({});
  const [userDo, setUserDo] = useState("");

  const [userId, setUserId] = useState("");
  
  const [msgInput, setMsgInput] = useState("");
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    if (memberId === null) {
      axios.get(`${process.env.REACT_APP_DB_HOST}chatting/getSessionInfo`, { 
        withCredentials: true
      }).then((response) => {
        setMemberId(response.data);
      })
      .catch((error) => {
        console.log("Chat Room Get Session Info", error);
      });
    } else {
      getBoardInfo();
    }
  }, [memberId]);

  const getBoardInfo = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/getBoardInfo?roomId=${id}`,
      );

      setBoardInfo({
        sellerMemberId: response.data.sellerMemberId,
        sellerNickname: response.data.sellerNickname,
        buyerMemberId: response.data.buyerMemberId,
        buyerNickname: response.data.buyerNickname,
        image: response.data.image,
        title: response.data.title,
        price: response.data.price,
      })

      initSocketConnect();
      // 리더님 이거 연결이 됐다가 안됐다가...

      if (memberId == response.data.sellerMemberId) {
        const Do = "판매";
        setUserDo(Do);
        noticeFunc(Do);
        setMyNickname(response.data.sellerNickname);
        setOtherNickname(response.data.buyerNickname);
      } else if (memberId == response.data.buyerMemberId) {
        const Do = "구매";
        setUserDo(Do);
        noticeFunc(Do);
        setMyNickname(response.data.buyerNickname);
        setOtherNickname(response.data.sellerNickname);
      } else {
        console.log("잘못된 접근입니다.");
        return;
      }
    } catch (error) {
      console.error('Get Board Info Error:', error);
    }
  };

  const initSocketConnect = () => {
    console.log("connected", socket.connected);
    if (!socket.connected) {
      socket.connect();
      socket.emit("entry", { memberId: memberId });
    }
  };

  const noticeFunc = (Do) => {
    const notice = (res) => {
      const msg = `${Do}자님이 입장하셨습니다.`;
      const newChatList = [...chatList, { type: "notice", content: msg }];
      setChatList(newChatList);
    };

    socket.on("notice", notice);
    return () => socket.off("notice", notice);
  }

  const sendMsg = () => {
    if (msgInput !== "") {
      socket.emit("sendMsg", { memberId: memberId, msg: msgInput });
      setMsgInput("");
    }
  };

  useEffect(() => {
    // 리더님 아래 코드가 필요없는데
    // 왜 이 코드를 주석처리하면 notice가 안뜰까요?
    socket.on("entrySuccess", (res) => {
      setUserId(res.memberId);
    });

    // socket.on("error", (res) => {
    //   alert(res.msg);
    // });
  }, []);

  const getChatText = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/getChatText?roomId=${id}`,
      );

      console.log(response)
      // setBoardInfo({
      //   sellerMemberId: response.data.sellerMemberId,
      //   sellerNickname: response.data.sellerNickname,
      //   buyerMemberId: response.data.buyerMemberId,
      //   buyerNickname: response.data.buyerNickname,
      //   image: response.data.image,
      //   title: response.data.title,
      //   price: response.data.price,
      // })

    } catch (error) {
      console.error('Get Chat Text Error:', error);
    }
  };

  const addChatList = useCallback(
    (res) => {
      const nickname = res.memberId === memberId ? myNickname : otherNickname;
      const type = res.memberId === memberId ? "my" : "other";
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
        // console.log(chatData);
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_DB_HOST}chatRoom/:id/postChat`,
          chatData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
    
            console.log("response!!!!!!!!!!!", response);
        } catch (error) {
          console.error('Post Chat Error:', error);
        }
      };
      postChat();
    },
    [userId, chatList]
  );

  useEffect(() => {
    socket.on("chat", addChatList);
    return () => socket.off("chat", addChatList);
  }, [addChatList])

  // const entryChat = () => {
  //   socket.emit("entry", { userId: memberId });
  // };

  return (
    <>
      <div className="container text-center" style={{ backgroundColor: 'lightyellow', marginBottom: '10px' }}>
        <div className="row">
          <div className="col">
          {boardInfo.image}
          </div>
          <div className="col-6">
            <div>{boardInfo.title}</div>
            <div>{boardInfo.price}</div>
            <div>{boardInfo.starAvg}</div>
          </div>
          <div className="col">
            <div>{boardInfo.sellerNickname}</div>
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
