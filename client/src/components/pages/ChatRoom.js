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

  const [otherMemberId, setOtherMemberId] = useState(null);
  const [otherNickname, setOtherNickname] = useState(null);
  const [boardInfo, setBoardInfo] = useState({});
  const [roomName, setRoomName] = useState(null);
  const [userDo, setUserDo] = useState(null);
  const [otherDo, setOtherrDo] = useState("");
  
  const [msgInput, setMsgInput] = useState("");
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    getBoardInfo();
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

      setRoomName(response.data.title)

      const sell = "판매";
      const buy = "구매";
      if (memberId == response.data.sellerMemberId) {
        setUserDo(sell);
        setOtherrDo(buy)
        setOtherNickname(response.data.buyerNickname);
        setOtherMemberId(response.data.buyerMemberId);
      } else if (memberId == response.data.buyerMemberId) {
        setUserDo(buy);
        setOtherrDo(sell)
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

  useEffect(() => {
    initSocketConnect();
    if (userDo !== null) {
      socket.emit("entry", { memberId: memberId, roomName: roomName, userDo: userDo });
    }
  }, [roomName]);

  const initSocketConnect = () => {
    if (!socket.connected) {
      socket.connect();
      console.log("connected", socket.connected);
    }
  };

  const notice = useCallback((res) => {
    const newChatList = [
      ...chatList,
      {
        type: "notice",
        content: `${res.msg}`,
        roomName: roomName,
        userDo: userDo,
      },
    ];
    setChatList(newChatList);
  }, [userDo, chatList, roomName]);

  useEffect(()=>{
    socket.on("notice", notice);
    return () => socket.off("notice", notice)
  },[notice])

  const sendMsg = () => {
    if (msgInput !== "") {
      socket.emit("sendMsg", { memberId: memberId, msg: msgInput, roomName: roomName });
      setMsgInput("");
    }
  };

  useEffect(() => {
    getChatText();
  }, [otherMemberId]);

  const getChatText = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/getChatText?roomId=${id}&myMemberId=${memberId}&otherMemberId=${otherMemberId}`,
      );
  
      console.log("response.data", response.data);
      let newChatList = []; // 빈 배열로 초기화
  
      for (let i = 0; i < response.data.length; i++) {
        const type = response.data[i].memberId === memberId ? "my" : "other";
        const nick = response.data[i].memberId === memberId ? "" : otherNickname;
        const content = `${response.data[i].chatText}`;
        const newItem = {
          type: type,
          nickname: nick,
          content: content,
          createdAt: response.data[i].createdAt,
        };
        newChatList.push(newItem); // chatList에 요소 추가
      }
  
      setChatList(newChatList);
    } catch (error) {
      console.error("Get Chat Text Error:", error);
    }
  };

  const addChatList = useCallback(
    (res) => {
      const type = res.memberId === memberId ? "my" : "other";
      const nick = res.memberId === memberId ? "" : otherNickname;
      const content = `${res.msg}`
      const newChatList = [
        ...chatList,
        { type: type, nickname: nick, content: content },
      ];
      setChatList(newChatList);

      const chatData = {};

      if (type === "my") {
        chatData.roomId = id;
        chatData.memberId = memberId;
        chatData.chatText = content;
      }
      
      const postChat = async() => {
        try {
          await axios.post(
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

  const exitRoom = () => {
    socket.emit("disconnection", { roomName: roomName, userDo: userDo });
    window.history.back(); // 이전 페이지로 이동
  };

  // window.onpageshow = function(event) {
  //   if ( event.persisted || (window.performance && window.performance.navigation.type == 2)) {
  //     console.log('back button event');
  //   }
  // }

  // socket.on("bye", () => {
  //   const newChatList = [...chatList, { type: "notice", content: "bye" }];
  //   setChatList(newChatList);
  // })

  // useEffect(() => {
  //   if (window.performance && window.performance.navigation.type == 2) {
  //     console.log("out2")
  //   }
  // }, []);


  return (
    <>
      <div className="container text-center" style={{ backgroundColor: 'lightyellow', marginBottom: '10px' }}>
        <div className="row">
          <div className="col">
            <button onClick={exitRoom}>목록 보기</button>
          </div>
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

const mapStateToProps = (state) => ({
  user: state.auth,
});

const ConnectedChatRoom = connect(mapStateToProps)(ChatRoom);

export default ConnectedChatRoom;
