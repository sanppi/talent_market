import "../../styles/chat.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import Chat from "./Chat";
import Notice from "./Notice";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8000", { autoConnect: false });

function ChatRoom({ user }) {
  const { memberId, nickname, redCard } = user;

  const { id } = useParams();

  const [otherNickname, setOtherNickname] = useState(null);
  const [otherMemberId, setOtherMemberId] = useState(null);
  const [boardInfo, setBoardInfo] = useState({});
  const [userDo, setUserDo] = useState("");

  
  const [msgInput, setMsgInput] = useState("");
  const [preChatList, setPreChatList] = useState([]);
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    getBoardInfo();
    getChatText();
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

      if (memberId == response.data.sellerMemberId) {
        const Do = "판매";
        setUserDo(Do);
        noticeFunc(Do);
        setOtherNickname(response.data.buyerNickname);
        setOtherMemberId(response.data.buyerMemberId);
      } else if (memberId == response.data.buyerMemberId) {
        const Do = "구매";
        setUserDo(Do);
        noticeFunc(Do);
        setOtherNickname(response.data.sellerNickname);
        setOtherMemberId(response.data.sellerMemberId);
      } else {
        console.log("잘못된 접근입니다.");
        return;
      }
    } catch (error) {
      console.error('Get Board Info Error:', error);
    }
  };

  const initSocketConnect = () => {
    if (!socket.connected) {
      socket.connect();
      console.log("connected", socket.connected);
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



  const getChatText = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/getChatText?roomId=${id}&myMemberId=${memberId}&otherMemberId=${otherMemberId}`,
      );

      console.log("response.data!!!!!!!!!!!!!!!!!", response.data[0])

      // for (let i = 0; i < response.data.length; i++) {
      //   const type = response.data[i].memberId === memberId ? "my" : "other";
      //   const content = `${response.data[i].chatText}`
      //   const newChatList = [
      //     ...chatList,
      //     { type: type, content: content, createdAt: response.data[i].createdAt },
      //   ];
      //   setChatList(newChatList);
      // }
      console.log(chatList)
    } catch (error) {
      console.error('Get Chat Text Error:', error);
    }
  };

  useEffect(() => {
    console.log("chatList", chatList)
  }, [chatList]);

  const addChatList = useCallback(
    (res) => {
      const type = res.memberId === memberId ? "my" : "other";
      const content = `${res.msg}`
      const newChatList = [
        ...chatList,
        { type: type, content: content },
      ];
      setChatList(newChatList);

      const chatData = {};

      if (type === "my") {
        chatData.roomId = id;
        chatData.memberId = memberId;
        chatData.chatText = content;
      } else if (type === "other") {
        chatData.roomId = id;
        chatData.memberId = otherMemberId;
        chatData.chatText = content;
      }
      
      const postChat = async() => {
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
    
        } catch (error) {
          console.error('Post Chat Error:', error);
        }
      };
      postChat();
    },
    [chatList]
  );

  useEffect(() => {
    socket.on("chat", addChatList);
    return () => socket.off("chat", addChatList);
  }, [addChatList])

  useEffect(() => {
    // socket.on("error", (res) => {
    //   alert(res.msg);
    // });
  }, []);

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
            <div>{otherNickname}</div>
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

const mapStateToProps = (state) => ({
  user: state.auth,
});

const ConnectedChatRoom = connect(mapStateToProps)(ChatRoom);

export default ConnectedChatRoom;
