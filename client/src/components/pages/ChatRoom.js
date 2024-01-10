import '../../styles/chat.scss';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import Chat from './Chat';
import Notice from './Notice';
import Confirmed from './Confirmed';
import io from 'socket.io-client';
import Footer from '../pages/Footer';

const socket = io.connect(process.env.REACT_APP_DB_HOST, {
  autoConnect: false,
});

function ChatRoom({ user }) {
  const { memberId, nickname, redCard } = user;

  const { id } = useParams();

  const [otherMemberId, setOtherMemberId] = useState(null);
  const [otherNickname, setOtherNickname] = useState(null);
  const [boardInfo, setBoardInfo] = useState({});
  const [roomName, setRoomName] = useState(null);
  const [userDo, setUserDo] = useState(null);
  const [otherDo, setOtherrDo] = useState('');
  const [msgInput, setMsgInput] = useState('');
  const [chatList, setChatList] = useState([]);
  const [price, setPrice] = useState('');
  const [chatState, setChatState] = useState('');

  useEffect(() => {
    getBoardInfo();
  }, [memberId]);

  const getBoardInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/getBoardInfo?roomId=${id}`
      );

      setBoardInfo({
        sellerMemberId: response.data.sellerMemberId,
        sellerNickname: response.data.sellerNickname,
        buyerMemberId: response.data.buyerMemberId,
        buyerNickname: response.data.buyerNickname,
        image: response.data.image,
        title: response.data.title,
        price: response.data.price,
      });

      setRoomName(response.data.title);
      setPrice(response.data.price);
      setChatState(response.data.chatState);

      const sell = '판매';
      const buy = '구매';
      if (memberId == response.data.sellerMemberId) {
        setUserDo(sell);
        setOtherrDo(buy);
        setOtherNickname(response.data.buyerNickname);
        setOtherMemberId(response.data.buyerMemberId);
      } else if (memberId == response.data.buyerMemberId) {
        setUserDo(buy);
        setOtherrDo(sell);
        setOtherNickname(response.data.sellerNickname);
        setOtherMemberId(response.data.sellerMemberId);
      } else {
        console.log('잘못된 접근입니다.');
        return;
      }
    } catch (error) {
      console.error('Get Board Info Error:', error);
    }
  };

  useEffect(() => {
    initSocketConnect();
    if (userDo !== null) {
      socket.emit('entry', {
        memberId: memberId,
        roomName: roomName,
        userDo: userDo,
      });
    }
  }, [roomName]);

  const initSocketConnect = () => {
    if (!socket.connected) {
      socket.connect();
    }
  };

  const notice = useCallback(
    (res) => {
      if (
        userDo !== null &&
        chatList !== null &&
        chatList.length !== 0 &&
        roomName !== null
      ) {
        const newChatList = [
          ...chatList,
          {
            type: 'notice',
            content: `${res.msg}`,
            roomName: roomName,
            userDo: userDo,
          },
        ];
        setChatList(newChatList);
      } else {
        console.log('Notice Error');
      }
    },
    [userDo, chatList, roomName]
  );

  useEffect(() => {
    socket.on('notice', notice);
    return () => socket.off('notice', notice);
  }, [notice]);

  const sendMsg = () => {
    if (msgInput !== '') {
      socket.emit('sendMsg', {
        memberId: memberId,
        msg: msgInput,
        roomName: roomName,
      });
      setMsgInput('');
    }
  };

  const getChatText = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/getChatText?roomId=${id}&myMemberId=${memberId}&otherMemberId=${otherMemberId}`
      );

      let newChatList = []; // 빈 배열로 초기화

      for (let i = 0; i < response.data.length; i++) {
        const type = response.data[i].memberId === memberId ? 'my' : 'other';
        const nick =
          response.data[i].memberId === memberId ? '' : otherNickname;
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
      console.error('Get Chat Text Error:', error);
    }
  };

  useEffect(() => {
    getChatText();
  }, [otherMemberId]);

  const postChat = async (chatData) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/postChat`,
        chatData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Post Chat Error:', error);
    }
  };

  const patchChatState = async (data) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/patchChatState`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setChatState(data.chatState);
    } catch (error) {
      console.error('Patch Chat State Error:', error);
    }
  };

  const addChatList = useCallback(
    (res) => {
      const type = res.memberId === memberId ? 'my' : 'other';
      const nick = res.memberId === memberId ? '' : otherNickname;
      const content = `${res.msg}`;
      const newChatList = [
        ...chatList,
        { type: type, nickname: nick, content: content },
      ];
      setChatList(newChatList);

      const chatData = {};

      if (type === 'my') {
        chatData.roomId = id;
        chatData.memberId = memberId;
        chatData.chatText = content;
      }

      postChat(chatData);
    },
    [chatList]
  );

  useEffect(() => {
    socket.on('chat', addChatList);
    return () => socket.off('chat', addChatList);
  }, [addChatList]);

  const exitRoom = () => {
    socket.emit('disconnection', { roomName: roomName, userDo: userDo });
    window.history.back(); // 이전 페이지로 이동
  };

  useEffect(() => {
    return () => {
      socket.emit('disconnection', { roomName: roomName, userDo: userDo });
    };
  }, []);

  const sell = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/getAccountNumber?memberId=${memberId}}`
      );

      if (!response.data) {
        alert('판매 확정이 불가능 합니다. 계좌번호를 확인해주세요.');
      } else {
        const confirmed = window.confirm(
          `${response.data.bankName} ${response.data.accountNum} 이 계좌번호가 맞습니까?`
        );
        if (confirmed) {
          socket.emit('sell', {
            roomName: roomName,
            memberId: memberId,
            bankName: response.data.bankName,
            accountNum: response.data.accountNum,
          });
        } else {
          sellCancel();
          console.log('sellCancel');
        }
      }
    } catch (error) {
      console.error('Get Account Number Error:', error);
    }
  };

  const sellConfirmed = useCallback(
    (res) => {
      let resMemberId = res.memberId;
      let resBankName = res.bankName;
      let resAccountNum = res.accountNum;
      if (price !== '' && chatList !== null && chatList.length !== 0) {
        const type = res.memberId === memberId ? 'my' : 'other';
        const nick = resMemberId === memberId ? '' : otherNickname;
        const newChatList = [
          ...chatList,
          {
            type: 'confirmed',
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
          chatState: 'sale',
        };

        patchChatState(data);
      } else {
        console.log('Sell Confirmed Error');
      }
    },
    [chatList]
  );

  useEffect(() => {
    socket.on('sellConfirmed', sellConfirmed);
    return () => socket.off('sellConfirmed', sellConfirmed);
  }, [sellConfirmed]);

  useEffect(() => {
    if (chatState == 'sale') {
      socket.emit('canBuy', { chatState: chatState });
    }
  }, [chatState]);

  const buyConfirmed = useCallback(
    (res) => {
      const data = {
        roomId: id,
        chatState: res.chatState,
      };
      patchChatState(data);
    },
    [id]
  );

  useEffect(() => {
    socket.on('buy', buyConfirmed);
  }, [chatState]);

  useEffect(() => {
    if (chatState == 'done') {
      socket.emit('done', { chatState: chatState });
    }
  }, [chatState]);

  const check = useCallback(
    (res) => {
      const data = {
        roomId: id,
        chatState: res.chatState,
      };
      patchChatState(data);
    },
    [id]
  );

  useEffect(() => {
    socket.on('check', check);
  }, [chatState]);

  const sendSellBuyMsg = (msg, myMemberId) => {
    const newChatList = [
      ...chatList,
      {
        type: 'notice',
        content: msg,
      },
    ];

    setChatList(newChatList);

    const chatData = {
      roomId: id,
      memberId: myMemberId,
      chatText: msg,
    };

    postChat(chatData);
  };

  const sellCancel = () => {
    const msg = '판매자가 판매를 취소하였습니다.';
    sendSellBuyMsg(msg, memberId);

    const data = {
      roomId: id,
      chatState: 'ready',
    };

    patchChatState(data);
  };

  const sellCheck = () => {
    const patchBuyerInfo = async () => {
      const sellData = {
        roomId: id,
      };

      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_DB_HOST}chatRoom/:id/patchBuyerInfo`,
          sellData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.data) {
          sendSellBuyMsg('거래가 완료되었습니다.', memberId);
        } else {
          sendSellBuyMsg('거래가 성사되지 않았습니다.', memberId);
        }
        const data = {
          roomId: id,
          chatState: 'ready',
        };

        patchChatState(data);
      } catch (error) {
        console.error('Patch Buyer Info Error:', error);
      }
    };

    patchBuyerInfo();
  };

  const buy = () => {
    const msg =
      '구매자가 결제를 완료하였습니다. 입금내역을 확인 후 확인 완료를 눌러주세요.';
    sendSellBuyMsg(msg, memberId);

    const data = {
      roomId: id,
      chatState: 'done',
    };

    patchChatState(data);
  };

  const buyCancel = () => {
    const msg = '구매자가 구매를 취소하였습니다.';
    sendSellBuyMsg(msg, memberId);

    const data = {
      roomId: id,
      chatState: 'ready',
    };

    patchChatState(data);
  };

  useEffect(() => {
    console.log(chatState);
  }, [chatState]);

  // var SelectedFile;
  // function FileChosen(event) {
  //   SelectedFile = event.target.files[0];
  //   document.getElementById('NameBox').value = SelectedFile.name;
  // }
  // var fileReader;
  // var Name;
  // function StartUpload(){
  //   if(document.getElementById('FileBox').value != "") {
  //     fileReader = new FileReader();
  //     console.log(SelectedFile.type);
  //     Name = document.getElementById('NameBox').value;
  //     var Content = "<span id='NameArea'>Uploading " + SelectedFile.name + " as " + Name + "</span>";
  //     Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "MB</span>";
  //     document.getElementById('UploadArea').innerHTML = Content;
  //     fileReader.onload = function(event){
  //       if (!event) {
  //         var data = fileReader.content;
  //       }
  //       else {
  //         var data = event.target.result;
  //       }
  //       socket.emit('Upload', { 'Name' : Name, Data : data });
  //     }
  //     socket.emit('Start', { 'Name' : Name, 'Size' : SelectedFile.size });
  //   }
  //   else {
  //     alert("Please Select A File");
  //   }
  // }

  // window.addEventListener("load", Ready);
  // function Ready(){
  //   if(window.File && window.FileReader){
  //     document.getElementById('UploadButton').addEventListener('click', StartUpload);
  //     document.getElementById('FileBox').addEventListener('change', FileChosen);
  //   }
  //   else
  //   {
  //     document.getElementById('UploadArea').innerHTML = "지원되지 않는 브라우저입니다. 브라우저를 업데이트하거나 IE나 Chrome을 사용하세요.";
  //   }
  // }

  return (
    <>
      <div className="chattingContainer">
        <div className="chattingBox">
          <div className="chattingBoardBox">
            <div className="chattngBoardInfo">
              <button className="chattingBoardBtn" onClick={exitRoom}>
                &#60;
              </button>
              <div className="chattingBoardOne">
                <img
                  src={`${
                    process.env.REACT_APP_DB_HOST
                  }static/userImg/${encodeURIComponent(boardInfo.image)}`}
                  alt="board img"
                />
              </div>
              <div className="chattingBoardOne">
                <div className="chattingBoardTitle">{boardInfo.title}</div>
                <div className="chattingBoardPrice">{boardInfo.price}원</div>
                {/* <div>{boardInfo.starAvg}</div> */}
              </div>
              <div className="chattingBoardOne">{boardInfo.sellerNickname}</div>
            </div>

            <div className="chatting">
              <div className="chattingTextList">
                {chatList.map((chat, i) => {
                  if (chat.type === 'notice')
                    return <Notice key={i} chat={chat} />;
                  else if (chat.type === 'confirmed')
                    return <Confirmed key={i} chat={chat} />;
                  else return <Chat key={i} chat={chat} />;
                })}
              </div>
              <div className="bottomBtnBox">
                {userDo === '판매' ? (
                  chatState === 'ready' ? (
                    <div className="bottomBtns">
                      <button onClick={sell}>판매 확정</button>
                      <button onClick={sellCancel}>판매 취소</button>
                    </div>
                  ) : chatState === 'sale' ? (
                    <></>
                  ) : (
                    <div>
                      <button onClick={sellCheck}>확인 완료</button>
                    </div>
                  )
                ) : chatState === 'sale' ? (
                  <div className="bottomBtns">
                    <button onClick={buy}>구매 확정</button>
                    <button onClick={buyCancel}>구매 취소</button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="chattingInputContainer">
            <input
              type="text"
              className="chattingInput"
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMsg();
                }
              }}
            />
            <button className="chattingBtn" onClick={sendMsg}>
              ✉︀
            </button>
          </div>
          {/* <div id="UploadBox">
            <h2>Video Uploader</h2>
            <span id='UploadArea'>
              <label for="FileBox">Choose A File: </label>
              <input type="file" id="FileBox" />
              <br />
              <label for="NameBox">Name: </label>
              <input type="text" id="NameBox" />
              <br />
            </span>
          </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth,
});

const ConnectedChatRoom = connect(mapStateToProps)(ChatRoom);

export default ConnectedChatRoom;
