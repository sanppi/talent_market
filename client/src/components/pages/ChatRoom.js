import '../../styles/chat.scss';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import Chat from './Chat';
import Notice from './Notice';
import Confirmed from './Confirmed';
import io from 'socket.io-client';
import Footer from '../pages/Footer';
import useToggle from '../hook/UseToggle';
import ModalBasic from '../ModalBasic';

const socket = io.connect(process.env.REACT_APP_DB_HOST, {
  autoConnect: false,
});

function ChatRoom({ user }) {
  // memberId는 여기
  const { memberId } = user;

  const { id } = useParams();

  const [otherMemberId, setOtherMemberId] = useState(null);
  const [otherNickname, setOtherNickname] = useState(null);
  const [boardInfo, setBoardInfo] = useState({});
  const [roomName, setRoomName] = useState(null);
  const [userDo, setUserDo] = useState(null);

  const [msgInput, setMsgInput] = useState('');
  const [chatList, setChatList] = useState([]);
  const [price, setPrice] = useState('');

  const [chatState, setChatState] = useState('ready');

  const [image, setImage] = useState();
  const [imagePath, setImagePath] = useState('');

  const [modalToggle, onModalToggle] = useToggle(false);
  const [modalType, setModalType] = useState('');
  const chatScrollRef = useRef(null);
  const navigate = useNavigate();

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
        setOtherNickname(response.data.buyerNickname);
        setOtherMemberId(response.data.buyerMemberId);
      } else if (memberId == response.data.buyerMemberId) {
        setUserDo(buy);
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

      let type;
      let nick;
      for (let i = 0; i < response.data.length; i++) {
        console.log(response.data[i].chatType);
        if (response.data[i].chatType == 'notice') {
          type = 'transactionNotice';
          nick = '';
        } else {
          type = response.data[i].memberId === memberId ? 'my' : 'other';
          nick = response.data[i].memberId === memberId ? '' : otherNickname;
        }
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
        chatData.chatType = 'chat';
        postChat(chatData);
      }
    },
    [chatList]
  );

  useEffect(() => {
    socket.on('chat', addChatList);
    return () => socket.off('chat', addChatList);
  }, [addChatList]);

  const addChatNotice = useCallback(
    (res) => {
      const type = 'transactionNotice';
      const content = `${res.msg}`;
      const newChatList = [...chatList, { type: type, content: content }];
      setChatList(newChatList);

      const chatData = {};

      if (res.memberId === memberId) {
        chatData.roomId = id;
        chatData.memberId = memberId;
        chatData.chatText = content;
        chatData.chatType = 'notice';

        postChat(chatData);
      }
    },
    [chatList]
  );

  useEffect(() => {
    socket.on('transactionNotice', addChatNotice);
    return () => socket.off('transactionNotice', addChatNotice);
  }, [addChatNotice]);

  const exitRoom = () => {
    socket.emit('disconnection', { roomName: roomName, userDo: userDo });
    window.history.back(); // 이전 페이지로 이동
  };

  useEffect(() => {
    return () => {
      socket.emit('disconnection', { roomName: roomName, userDo: userDo });
    };
  }, []);

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

  const stateReceive = useCallback(
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
    socket.on('stateReceive', stateReceive);
  }, [chatState]);

  const wantBuy = () => {
    const msg = '상품 구매 요청을 받았습니다!';
    socket.emit('sendNotice', {
      memberId: memberId,
      msg: msg,
      roomName: roomName,
    });

    const data = {
      roomId: id,
      chatState: 'want',
    };

    patchChatState(data);
    socket.emit('stateGive', { chatState: data.chatState });
  };

  const sell = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/getAccountNumber?memberId=${memberId}}`
      );

      if (!response.data) {
        onModalToggle();
        setModalType('판매 확정이 불가능 합니다. 계좌번호를 확인해주세요.');
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
          socket.emit('stateGive', { chatState: 'sale' });
        } else {
          sellCancel();
          console.log('sellCancel');
        }
      }
    } catch (error) {
      console.error('Get Account Number Error:', error);
    }
  };

  const sellCancel = () => {
    const msg = '판매자가 판매를 취소하였습니다.';
    socket.emit('sendNotice', {
      memberId: memberId,
      msg: msg,
      roomName: roomName,
    });

    const data = {
      roomId: id,
      chatState: 'ready',
    };

    patchChatState(data);
    socket.emit('stateGive', { chatState: data.chatState });
  };

  const buy = () => {
    const msg = '구매자가 결제를 완료하였습니다.';
    socket.emit('sendNotice', {
      memberId: memberId,
      msg: msg,
      roomName: roomName,
    });

    const data = {
      roomId: id,
      chatState: 'done',
    };

    patchChatState(data);
    socket.emit('stateGive', { chatState: data.chatState });
  };

  const buyCancel = () => {
    const msg = '구매자가 구매를 취소하였습니다.';
    socket.emit('sendNotice', {
      memberId: memberId,
      msg: msg,
      roomName: roomName,
    });

    const data = {
      roomId: id,
      chatState: 'ready',
    };

    patchChatState(data);
    socket.emit('stateGive', { chatState: data.chatState });
  };

  const sellConfirmed = useCallback(
    (res) => {
      let resBankName = res.bankName;
      let resAccountNum = res.accountNum;
      if (price !== '' && chatList !== null && chatList.length !== 0) {
        const newChatList = [
          ...chatList,
          {
            type: 'transactionNotice',
            content: `계좌번호: ${res.bankName} ${res.accountNum}. 결제 후 구매 확정 버튼을 눌러주세요.`,
          },
        ];

        setChatList(newChatList);

        const chatData = {
          roomId: id,
          memberId: res.memberId,
          chatText: `계좌번호: ${resBankName} ${resAccountNum}.
            결제 후 구매 확정 버튼을 눌러주세요.`,
          chatType: 'notice',
        };

        postChat(chatData);

        const data = {
          roomId: id,
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
        const msg = '구매하신 상품이 도착했습니다!';
        socket.emit('sendNotice', {
          memberId: memberId,
          msg: msg,
          roomName: roomName,
        });
      } else {
        const msg = '구매 정보 업데이트 에러입니다.';
        socket.emit('sendNotice', {
          memberId: memberId,
          msg: msg,
          roomName: roomName,
        });
      }
    } catch (error) {
      console.error('Patch Buyer Info Error:', error);
    }
  };

  const sellCheck = () => {
    patchBuyerInfo();

    const data = {
      roomId: id,
      chatState: 'check',
    };

    patchChatState(data);
    socket.emit('stateGive', { chatState: data.chatState });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('image', image);
    formData.append('roomId', id);

    if (!image) {
      // 윤혜님
      alert("파일을 업로드 해주세요!")
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_DB_HOST}chatRoom/:id/sendFile`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setImagePath(response.data);
        socket.emit('fileGive', { imagePath: response.data });
        sellCheck();
      } catch (error) {
        onModalToggle();
        setModalType('파일 전송에 실패했습니다. 잠시 후 다시 시도해주세요');
      }
    }
  };

  const fileReceive = useCallback((res) => {
    setImagePath(res.imagePath);
  }, []);

  useEffect(() => {
    socket.on('fileReceive', fileReceive);
  }, [fileReceive]);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const getFile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatRoom/:id/getFile?roomId=${id}`
      );

      setImagePath(response.data);
    } catch (error) {
      console.error('Get File Error:', error);
    }
  };

  const downloadFile = () => {
    if (imagePath === '') {
      getFile();
    } else {
      const fileUrl = `${process.env.REACT_APP_DB_HOST}${imagePath}`; // 다운로드할 파일의 URL
      const newWindow = window.open(fileUrl); // 새 창 열기

      setTimeout(() => {
        newWindow.focus(); // 새 창에 포커스 설정
      }, 2000); // 1초 후에 포커스 설정

      const msg = '거래가 완료되었습니다';
      socket.emit('sendNotice', {
        memberId: memberId,
        msg: msg,
        roomName: roomName,
      });

      const data = {
        roomId: id,
        chatState: 'ready',
      };

      patchChatState(data);
      socket.emit('stateGive', { chatState: data.chatState });
    }
  };

  useEffect(() => {
    if (imagePath !== '' && userDo === '구매') {
      getFile();
    }
  }, [imagePath]);

  useEffect(() => {
    if (memberId) {
      chatScrollRef.current.scrollIntoView({ bahavior: 'smooth' });
    }
  }, [chatList]);

  useEffect(() => {
    if (!memberId) navigate('/member/signin');
  }, [memberId]);

  return (
    <>
      {memberId && (
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
                    <div className="chattingBoardPrice">
                      {boardInfo.price}원
                    </div>
                    {/* <div>{boardInfo.starAvg}</div> */}
                  </div>
                  <div className="chattingBoardOne">
                    {boardInfo.sellerNickname}
                  </div>
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
                  <div ref={chatScrollRef}></div>
                </div>
              </div>
              <div className="bottomBtnBox">
                {chatState === 'ready' ? (
                  userDo === '구매' ? (
                    <div className="bottomBtns">
                      <button onClick={wantBuy}>구매 요청</button>
                    </div>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
                {chatState === 'want' ? (
                  userDo === '판매' ? (
                    <div className="bottomBtns">
                      <button onClick={sell}>판매 확정</button>
                      <button onClick={sellCancel}>판매 취소</button>
                    </div>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
                {chatState === 'sale' ? (
                  userDo === '구매' ? (
                    <div className="bottomBtns">
                      <button onClick={buy}>구매 확정</button>
                      <button onClick={buyCancel}>구매 취소</button>
                    </div>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
                {chatState === 'done' ? (
                  userDo === '판매' ? (
                    <div className="fileFormBox">
                      <form className="fileForm" onSubmit={handleSubmit}>
                        <label htmlFor="fileInput">
                          {!image && (
                            <div className="fileExImage">
                              <img
                                src="/static/camera.png"
                                alt="img example"
                                className="exImage"
                                style={{ width: '65px', height: '50px' }}
                              />
                            </div>
                          )}
                          <input
                            id="fileInput"
                            type="file"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                          />
                          {image && (
                            <img
                              src={URL.createObjectURL(image)}
                              alt="preview"
                              className="exImage"
                              style={{ width: '150px' }}
                            />
                          )}
                        </label>
                        <button type="submit" className="submitButton">
                          상품 보내기
                        </button>
                      </form>
                    </div>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
                {chatState === 'check' ? (
                  userDo === '구매' ? (
                    <div className="bottomBtns">
                      <button onClick={downloadFile}>상품 받기</button>
                    </div>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
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
            </div>
          </div>
          {modalToggle && (
            <ModalBasic
              type="check"
              content={modalType}
              toggleState={true}
              setToggleState={onModalToggle}
            />
          )}
          <Footer />
        </>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth,
});

const ConnectedChatRoom = connect(mapStateToProps)(ChatRoom);

export default ConnectedChatRoom;
