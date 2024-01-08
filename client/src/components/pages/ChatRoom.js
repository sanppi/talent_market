import "../../styles/chat.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import Chat from "./Chat";
import Notice from "./Notice";
import Confirmed from "./Confirmed";
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
  const [price, setPrice] = useState("");
  const [isDone, setIsDone] = useState(false);

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
      setPrice(response.data.price)

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

  const renderButtons = () => {
    if (userDo === "판매") {
      if (isDone) {
        return (
          <div>
            <button onClick={sellCheck}>확인 완료</button>
          </div>
        );
      } else {
        return (
          <div>
            <button onClick={sell}>판매 확정</button>
            <button onClick={sellCancel}>판매 취소</button>
            <button onClick={sellCheck}>확인 완료</button>
          </div>
        );
      }
    } else if (userDo === "구매") {
      return (
        <div>
          <button onClick={buy}>구매 확정</button>
          <button onClick={buyCancel}>구매 취소</button>
        </div>
      );
    } else {
      return null; // 버튼을 숨기려면 null을 반환하면 됩니다.
    }
  };
  
  useEffect(() => {
    renderButtons();
  }, [isDone]);

  useEffect(() => {
    initSocketConnect();
    if (userDo !== null) {
      socket.emit("entry", { memberId: memberId, roomName: roomName, userDo: userDo });
    }
  }, [roomName]);

  const initSocketConnect = () => {
    if (!socket.connected) {
      socket.connect();
    }
  };

  const notice = useCallback((res) => {
    if (userDo !== null && chatList !== null && chatList.length !== 0 && roomName !== null) {
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
    }
    else {
      console.log("Notice Error")
    }
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

  const getChatText = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/getChatText?roomId=${id}&myMemberId=${memberId}&otherMemberId=${otherMemberId}`,
      );
  
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

  useEffect(() => {
    getChatText();
  }, [otherMemberId]);

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




  // 리더님 현재 브라우저가 꺼질때, 목록보기를 누를 때, 다른 채팅방에 들어갈 때에만 룸 나가기가 됩니다.
  // 페이지를 벗어나면 룸 나가기를 하고 싶은데 어떻게 해야할까요
  // window.addEventListener('beforeunload', function(event) {
  //   console.log("out2")
  // });

  // useEffect(() => {
  //   // if (window.performance && window.performance.navigation.type === 2) {
  //   //   console.log("out2")
  //   // }
  //   // window.onbeforeunload = function() {
  //   //   console.log("out2")
  //   // };
  //   // window.addEventListener('beforeunload', function(event) {
  //   //   event.returnValue = '이 페이지를 벗어나시겠습니까?';
  //   return ()=>{socket.emit("disconnection", { roomName: roomName, userDo: userDo });}
  // }, []);




  const sell = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/getAccountNumber?memberId=${memberId}}`,
      );


      if (!response.data) {
        alert("판매 확정이 불가능 합니다. 계좌번호를 확인해주세요.")
      } else {
        const confirmed = window.confirm(`${response.data.bankName} ${response.data.accountNum} 이 계좌번호가 맞습니까?`);
        if (confirmed) {
          socket.emit("sell", { roomName: roomName, memberId: memberId, bankName: response.data.bankName, accountNum: response.data.accountNum });
        } else {
          sellCancel();
          console.log("sellCancel")
        }
      }
    } catch (error) {
      console.error("Get Account Number Error:", error);
    }
  };

  const sellConfirmed = useCallback((res) => {
    // 리더님 이거 두번씩 찍혀요ㅜ
    if (price !== "" && chatList !== null && chatList.length !== 0) {
      const newChatList = [
        ...chatList,
        {
          type: "confirmed",
          content: `${res.bankName} ${res.accountNum}`,
          price: price,
        },
      ];
  
      setChatList(newChatList);
  
      const chatData = {
        roomId: id,
        memberId: res.memberId,
        chatText: `계좌번호: ${res.bankName} ${res.accountNum}
        결제금액: ${price}`,
      };

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
    } else {
      console.log("Sell Confirmed Error")
    }
  }, [chatList]);

  useEffect(() => {
    socket.on("sellConfirmed", sellConfirmed);
    return () => socket.off("sellConfirmed", sellConfirmed);
  }, [sellConfirmed])

  const sendSellBuyMsg = (msg, myMemberId) => {
    const newChatList = [
      ...chatList,
      {
        type: "notice",
        content: msg,
      },
    ];

    setChatList(newChatList);

    const chatData = {
      roomId: id,
      memberId: myMemberId,
      chatText: msg,
    };

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
          console.error('Sell Buy Msg Error:', error);
        }
      };
      
      postChat();
  }

  const sellCancel = () => {
    const msg = "판매자가 판매를 취소하였습니다."
    sendSellBuyMsg(msg, memberId)
  }

  const sellCheck = () => {
    const patchBuyerInfo = async() => {
      const data = {
        roomId: id,
      }

        try {
          const response = await axios.patch(
            `${process.env.REACT_APP_DB_HOST}chatRoom/:id/patchBuyerInfo`,
          data,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          if (response.data) {
            sendSellBuyMsg("거래가 완료되었습니다.", memberId)
          } else {
            sendSellBuyMsg("거래가 성사되지 않았습니다.", memberId)
          }

    
        } catch (error) {
          console.error('Patch Buyer Info Error:', error);
        }
      };
      
      patchBuyerInfo();
  }

  const buy = () => {
    setIsDone(true)
    const msg = "구매자가 결제를 완료하였습니다. 입금내역을 확인 후 확인 완료를 눌러주세요."
    sendSellBuyMsg(msg, memberId)
  }

  const buyCancel = () => {
    const msg = "구매자가 구매를 취소하였습니다."
    sendSellBuyMsg(msg, memberId)
  }


  return (
    <>
      <div className="container text-center" style={{ backgroundColor: 'lightyellow', marginBottom: '10px' }}>
        <div className="row">
          <div className="col">
            <button onClick={exitRoom}>뒤로가기</button>
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
            else if (chat.type === "confirmed") return <Confirmed key={i} chat={chat} />;
            else return <Chat key={i} chat={chat} />;
          })}
          {/* <div>
            {userDo === "판매" ? (
              <div>
                <button onClick={sell}>판매 확정</button>
                <button onClick={sellCancel}>판매 취소</button>
              </div>
            ) : (
              <div>
                <button onClick={buy}>구매 확정</button>
                <button onClick={buyCancel}>구매 취소</button>
              </div>
            )}
          </div> */}
          <div>
            {userDo === "판매" ? (
              isDone ? (
                <div>
                  <button onClick={sellCheck}>확인 완료</button>
                </div>
              ) : (
                <div>
                  <button onClick={sell}>판매 확정</button>
                  <button onClick={sellCancel}>판매 취소</button>
                  <button onClick={sellCheck}>확인 완료</button>
                </div>
              )
            ) : (
              <div>
                <button onClick={buy}>구매 확정</button>
                <button onClick={buyCancel}>구매 취소</button>
              </div>
            )}
          </div>
            
        </div>
        <div className="input-container">
          <input
            type="text"
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMsg();
              }
            }}
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
