
import "../../styles/chat.css";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import Chat from "./Chat";
import Notice from "./Notice";
import Confirmed from "./Confirmed";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8000", { autoConnect: false });

function ChatRoom({ user }) {
  // memberId는 여기
  const { memberId, nickname, redCard } = user;

  const { id } = useParams();

  const [otherMemberId, setOtherMemberId] = useState(null);
  const [otherNickname, setOtherNickname] = useState(null);
  const [boardInfo, setBoardInfo] = useState({});
  const [roomName, setRoomName] = useState(null);
  const [userDo, setUserDo] = useState(null);
  
  const [msgInput, setMsgInput] = useState("");
  const [chatList, setChatList] = useState([]);
  const [price, setPrice] = useState("");

  const [chatState, setChatState] = useState("");

  const [image, setImage] = useState("");
  const [imagePath, setImagePath] = useState("");


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

      // roomName은 여기
      setRoomName(response.data.title)
      setPrice(response.data.price)
      setChatState(response.data.chatState)

      const sell = "판매";
      const buy = "구매";
      if (memberId == response.data.sellerMemberId) {
        setUserDo(sell);
        setOtherNickname(response.data.buyerNickname);
        setOtherMemberId(response.data.buyerMemberId);
      } else if (memberId == response.data.buyerMemberId) {
        setUserDo(buy);
        setOtherNickname(response.data.sellerNickname);
        setOtherMemberId(response.data.sellerMemberId);
      } else {
        console.log("잘못된 접근입니다.");
        return;
      }
    } catch (error) {
      console.error("Get Board Info Error:", error);
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

  // 여기가 시작
  const sendMsg = () => {
    if (msgInput !== "") {
      // console.log("memberId", memberId, "msgInput", msgInput, "roomName", roomName)
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

  const postChat = async(chatData) => {
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
      console.error("Post Chat Error:", error);
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

      postChat(chatData);
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

  useEffect(() => {
    return ()=>{socket.emit("disconnection", { roomName: roomName, userDo: userDo });}
  }, []);

  const patchChatState = async(data) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/patchChatState`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      setChatState(data.chatState)
    } catch (error) {
      console.error("Patch Chat State Error:", error);
    }
  };

  const stateReceive = useCallback((res) => {
    const data = {
      roomId: id,
      chatState: res.chatState,
    }
    patchChatState(data)
  }, [id]);

  useEffect(() => {
    socket.on("stateReceive", stateReceive);
  }, [chatState])

  const wantBuy = () => {
    const msg = "상품 구매 요청을 받았습니다. 판매 하시겠습니까?"
    socket.emit("sendNotice", { memberId: memberId, msg: msg, roomName: roomName });
    // sendSellBuyMsg(msg, memberId)

    const data = {
      roomId: id,
      chatState: "want",
    }

    patchChatState(data)
    socket.emit("stateGive", { chatState: data.chatState });
  };

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
          socket.emit("stateGive", { chatState: "sale" });
        } else {
          sellCancel();
          console.log("sellCancel")
        }
      }
    } catch (error) {
      console.error("Get Account Number Error:", error);
    }
  };

    // 여기2
  // const sendSellBuyMsg = (msg, myMemberId) => {
  //   const newChatList = [
  //     ...chatList,
  //     {
  //       type: "notice",
  //       content: msg,
  //     },
  //   ];

  //   setChatList(newChatList);

  //   const chatData = {
  //     roomId: id,
  //     memberId: myMemberId,
  //     chatText: msg,
  //   };
  
  //   postChat(chatData);
  // }

  const sellCancel = () => {
    const msg = "판매자가 판매를 취소하였습니다."
    socket.emit("sendNotice", { memberId: memberId, msg: msg, roomName: roomName });
    // sendSellBuyMsg(msg, memberId)

    const data = {
      roomId: id,
      chatState: "ready",
    }

    patchChatState(data)
    socket.emit("stateGive", { chatState: data.chatState });
  }

  const buy = () => {
    const msg = "구매자가 결제를 완료하였습니다. 입금 확인 후 상품을 보내주세요."
    socket.emit("sendNotice", { memberId: memberId, msg: msg, roomName: roomName });
    // sendSellBuyMsg(msg, memberId)

    const data = {
      roomId: id,
      chatState: "done",
    }

    patchChatState(data)
    socket.emit("stateGive", { chatState: data.chatState });
  }

  const buyCancel = () => {
    const msg = "구매자가 구매를 취소하였습니다."
    socket.emit("sendNotice", { memberId: memberId, msg: msg, roomName: roomName });
    // sendSellBuyMsg(msg, memberId)

    const data = {
      roomId: id,
      chatState: "ready",
    }

    patchChatState(data)
    socket.emit("stateGive", { chatState: data.chatState });
  }

  const sellConfirmed = useCallback((res) => {
    let resMemberId = res.memberId;
    let resBankName = res.bankName;
    let resAccountNum = res.accountNum;
    if (price !== "" && chatList !== null && chatList.length !== 0) {
      const type = res.memberId === memberId ? "my" : "other";
      const nick = resMemberId === memberId ? "" : otherNickname;
      const newChatList = [
        ...chatList,
        {
          type: "confirmed",
          subType: type,
          nickname: nick,
          content: `${res.bankName} ${res.accountNum}`,
          price: price,
        },
      ];
  
      setChatList(newChatList);

      const chatData = {
        roomId: id,
        memberId: res.memberId,
        chatText: `계좌번호: ${resBankName} ${resAccountNum}
        결제금액: ${price}
        결제 후 구매 확정 버튼을 눌러주세요.`,
      };

      postChat(chatData);

      const data = {
        roomId: id,
        chatState: "sale",
      }

      patchChatState(data)
    } else {
      console.log("Sell Confirmed Error")
    }
  }, [chatList]);

  useEffect(() => {
    socket.on("sellConfirmed", sellConfirmed);
    return () => socket.off("sellConfirmed", sellConfirmed);
  }, [sellConfirmed])

  // useEffect(() => {
  //   if (chatState == "sale") {
  //     socket.emit("canBuy", {chatState: chatState});
  //   }
  // }, [chatState])

  // const buyConfirmed = useCallback((res) => {
  //   const data = {
  //     roomId: id,
  //     chatState: res.chatState,
  //   }
  //   patchChatState(data)
  // }, [id]);

  // useEffect(() => {
  //   socket.on("buy", buyConfirmed);
  // }, [chatState])

  // useEffect(() => {
  //   if (chatState == "done") {
  //     socket.emit("done", {chatState: chatState});
  //   }
  // }, [chatState])

  // const check = useCallback((res) => {
  //   const data = {
  //     roomId: id,
  //     chatState: res.chatState,
  //   }
  //   patchChatState(data)
  // }, [id]);

  // useEffect(() => {
  //   socket.on("check", check);
  // }, [chatState])

  const uploadFile = () => {
    const msg = "구매하신 상품이 도착했습니다. 상품을 확인해주세요."
    socket.emit("sendNotice", { memberId: memberId, msg: msg, roomName: roomName });
    // sendSellBuyMsg(msg, memberId)

    const data = {
      roomId: id,
      chatState: "check",
    }

    patchChatState(data)
    socket.emit("stateGive", { chatState: data.chatState });
  };

  const downloadFile = () => {
    const msg = "거래가 완료되었습니다"
    socket.emit("sendNotice", { memberId: memberId, msg: msg, roomName: roomName });
    // sendSellBuyMsg(msg, memberId)

    const data = {
      roomId: id,
      chatState: "ready",
    }

    patchChatState(data)
    socket.emit("stateGive", { chatState: data.chatState });

    // const fileUrl = `${process.env.REACT_APP_DB_HOST}${imagePath}`; // 다운로드할 파일의 URL
    // const link = document.createElement('a');
    // link.href = fileUrl;
    // link.download = `${imagePath}`; // 다운로드될 파일의 이름
    // link.click();
  };

  const sellCheck = () => {
    const patchBuyerInfo = async() => {
      const sellData = {
        roomId: id,
      }

        try {
          const response = await axios.patch(
            `${process.env.REACT_APP_DB_HOST}chatRoom/:id/patchBuyerInfo`,
            sellData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          if (response.data) {
            let msg = "거래가 완료되었습니다."
            socket.emit("sendNotice", { memberId: memberId, msg: msg, roomName: roomName });
            // sendSellBuyMsg("거래가 완료되었습니다.", memberId)
          } else {
            let msg = "거래가 성사되지 않았습니다."
            socket.emit("sendNotice", { memberId: memberId, msg: msg, roomName: roomName });
            // sendSellBuyMsg("거래가 성사되지 않았습니다.", memberId)
          }
          const data = {
            roomId: id,
            chatState: "ready",
          }
      
          patchChatState(data)
    
        } catch (error) {
          console.error("Patch Buyer Info Error:", error);
        }
      };
      
      patchBuyerInfo();
  }





  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('image', image);
    formData.append('roomId', id);

    try {
      console.log(formData);
      const response = await axios.post(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/sendFile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // sellCheck();
    } catch (error) {
      alert('파일 전송에 실패했습니다. 잠시 후 다시 시도해주세요');
    }
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  // useEffect(()=>{
  //   console.log("image!!!!!!!!!!!!!!!!", image)
  // },[image])

  const getFile = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/getFile?roomId=${id}`,
      );

      setImagePath(response.data);
    } catch (error) {
      console.error("Get File Error:", error);
    }
  }

  useEffect(()=>{
    console.log("image!!!!!!!!!!!!!!!!", imagePath)
  },[imagePath])

  

  useEffect(()=>{
    console.log(chatState)
  }, [chatState])

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
          <div>
            {chatState === "ready" ? (
              userDo === "구매" ? (
                <button onClick={wantBuy}>구매 요청</button>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
            {chatState === "want" ? (
              userDo === "판매" ? (
                <div>
                  <button onClick={sell}>판매 확정</button>
                  <button onClick={sellCancel}>판매 취소</button>
                </div>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
            {chatState === "sale" ? (
              userDo === "구매" ? (
                <div>
                  <button onClick={buy}>구매 확정</button>
                  <button onClick={buyCancel}>구매 취소</button>
                </div>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
            {chatState === "done" ? (
              userDo === "판매" ? (
                // <form onSubmit={handleSubmit}>
                // <label htmlFor="fileInput">
                //   {!image && ( 
                //     <img src="/static/img.png" alt="img example" className="exImage" />
                //   )}
                //   <input
                //     id="fileInput"
                //     type="file"
                //     onChange={handleImageUpload}
                //     style={{ display: 'none' }}
                //   />
                //   {image && (
                //     <img
                //       src={URL.createObjectURL(image)}
                //       alt="preview"
                //       className="exImage"
                //     />
                //   )}
                // </label>
                <button onClick={uploadFile}>상품 ㄱㄱ</button>
              //   <button type="submit" className="submitButton">상품 보내기</button>
              // </form>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
            {chatState === "check" ? (
              userDo === "구매" ? (
                <button onClick={downloadFile}>상품 받기</button>
              ) : (
                <></>
              )
            ) : (
              <></>
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
