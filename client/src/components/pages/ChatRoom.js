// SB: 채팅방을 보여주는 파일입니다.
import '../../styles/chat.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import io from 'socket.io-client';
import Chat from './Chat';
import Notice from './Notice';
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

  const ENV_URL = process.env.REACT_APP_DB_HOST;

  // SB: 구매 관련 버튼을 누르면 구매 현황 정보를 DB에 저장하고 socket으로 전송하는 함수
  const handleAction = async (actionType) => {
    try {
      // Perform action based on actionType
      switch (actionType) {
        case 'wantBuy':
          socket.emit('sendNotice', {
            memberId: memberId,
            msg: '상품 구매 요청을 받았습니다!',
            roomName: roomName,
          });

          const wantBuyData = {
            roomId: id,
            chatState: 'want',
          };

          patchChatState(wantBuyData);
          socket.emit('stateGive', { chatState: wantBuyData.chatState });
          break;

        case 'sell':
          try {
            const response = await axios.get(
              `${ENV_URL}chatRoom/:id/getAccountNumber?memberId=${memberId}}`
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
                handleAction('sellCancel')
              }
            }
          } catch (error) {
            console.error('Get Account Number Error:', error);
          };
          break;

        case 'sellCancel':
          socket.emit('sendNotice', {
            memberId: memberId,
            msg: '판매자가 판매를 취소하였습니다.',
            roomName: roomName,
          });

          const sellCancelData = {
            roomId: id,
            chatState: 'ready',
          };

          patchChatState(sellCancelData);
          socket.emit('stateGive', { chatState: sellCancelData.chatState });
          break;

        case 'buy':
          socket.emit('sendNotice', {
            memberId: memberId,
            msg: '구매자가 결제를 완료하였습니다.',
            roomName: roomName,
          });

          const buyData = {
            roomId: id,
            chatState: 'done',
          };

          patchChatState(buyData);
          socket.emit('stateGive', { chatState: buyData.chatState });
          break;
        case 'buyCancel':
          socket.emit('sendNotice', {
            memberId: memberId,
            msg: '구매자가 구매를 취소하였습니다.',
            roomName: roomName,
          });
      
          const buyCancelData = {
            roomId: id,
            chatState: 'ready',
          };
      
          patchChatState(buyCancelData);
          socket.emit('stateGive', { chatState: buyCancelData.chatState });
          break;
        case 'downloadFile':
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
        break;
      }
    } catch (error) {
      console.error('Action Error:', error);
    }
  };

  const initSocketConnect = () => {
    if (!socket.connected) {
      socket.connect(); // socket 연결 코드입니다.
    }
  };

  // SB: 게시글 정보(판매자, 가격, 게시글 제목 등)를 DB에서 가져오는 함수
  const getBoardInfo = async () => {
    try {
      // 채팅방 정보를 가져오는 API 호출
      const response = await axios.get(
        `${ENV_URL}chatRoom/:id/getBoardInfo?roomId=${id}`
      );
  
      // API 응답 데이터를 기반으로 채팅방 정보 설정
      setBoardInfo({
        sellerMemberId: response.data.sellerMemberId, // 판매자 회원 ID
        sellerNickname: response.data.sellerNickname, // 판매자 닉네임
        buyerMemberId: response.data.buyerMemberId, // 구매자 회원 ID
        buyerNickname: response.data.buyerNickname, // 구매자 닉네임
        image: response.data.image, // 상품 이미지
        title: response.data.title, // 상품 제목
        price: response.data.price, // 상품 가격
      });
  
      setRoomName(response.data.title); // 채팅방 이름 설정
      setPrice(response.data.price); // 가격 설정
      setChatState(response.data.chatState); // 채팅 상태 설정
  
      const sell = '판매';
      const buy = '구매';
      if (memberId == response.data.sellerMemberId) {
        // 현재 사용자가 판매자인 경우
        setUserDo(sell); // 사용자 역할을 '판매'로 설정
        setOtherNickname(response.data.buyerNickname); // 상대방 닉네임 설정
        setOtherMemberId(response.data.buyerMemberId); // 상대방 회원 ID 설정
      } else if (memberId == response.data.buyerMemberId) {
        // 현재 사용자가 구매자인 경우
        setUserDo(buy); // 사용자 역할을 '구매'로 설정
        setOtherNickname(response.data.sellerNickname); // 상대방 닉네임 설정
        setOtherMemberId(response.data.sellerMemberId); // 상대방 회원 ID 설정
      } else {
        console.log('잘못된 접근입니다.'); // 잘못된 접근인 경우 에러 메시지 출력
        return;
      }
    } catch (error) {
      console.error('Get Board Info Error:', error); // 채팅방 정보 가져오기 오류 출력
    }
  };



  // SB: socket을 이용한 메세지 전송 함수
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

  // SB: 채팅 내역 조회 함수
  const getChatText = async () => {
    try {
      const response = await axios.get(
        `${ENV_URL}chatRoom/:id/getChatText?roomId=${id}&myMemberId=${memberId}&otherMemberId=${otherMemberId}`
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

  // SB: 채팅 내역 업로드 함수
  const postChat = async (chatData) => {
    try {
      await axios.post(
        `${ENV_URL}chatRoom/:id/postChat`,
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

  // SB: 채팅 내역(DB X, useState O)에 새로운 채팅을 추가하는 함수
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

  // SB: 채팅 내역에 공지사항을 추가하는 함수
  const notice = useCallback(
    (res) => {
      if (
        userDo !== null &&         // userDo가 null이 아닌지 확인
        chatList !== null &&       // chatList가 null이 아닌지 확인
        chatList.length !== 0 &&   // chatList의 길이가 0이 아닌지 확인
        roomName !== null          // roomName이 null이 아닌지 확인
      ) {
        const newChatList = [      // 새로운 채팅 리스트를 생성하여
          ...chatList,             // chatList를 그대로 복사하고
          {                        // 새로운 공지사항을 추가합니다.
            type: 'notice',        // 타입은 'notice'로 설정
            content: `${res.msg}`, // 메시지 내용은 res.msg로 설정
            roomName: roomName,    // 채팅방 이름 설정
            userDo: userDo,        // 사용자 동작 설정
          },
        ];
        setChatList(newChatList);  // 새로운 채팅 리스트로 chatList를 업데이트합니다.
      } else {
        console.log('Notice Error'); // 필요한 정보가 없는 경우 'Notice Error'를 출력합니다.
      }
    },
    [userDo, chatList, roomName] // userDo, chatList, roomName이 변경될 때마다 함수를 갱신합니다.
  );

  // SB: 채팅 내역에 거래 관련 공지사항을 추가하는 함수
  // 다른 공지사항(입장, 퇴장)과는 달리 DB에 저장해야할 필요성을 느껴 함수를 따로 만들었습니다
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

  // SB: 채팅방을 나가면 socket의 room도 나가게 하는 함수
  const exitRoom = () => {
    socket.emit('disconnection', { roomName: roomName, userDo: userDo });
    window.history.back(); // 이전 페이지로 이동
  };

  // SB: 채팅방 진행상황(구매 확정, 판매 확정 등등) 업데이트 함수
  const patchChatState = async (data) => {
    try {
      await axios.patch(
        `${ENV_URL}chatRoom/:id/patchChatState`,
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

  // SB: 채팅방 진행상황 공유 받기 함수
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

  // SB: 판매 확정에 걸린 함수
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

  // SB: 상품 확인에 걸린 함수. 게시글 정보와 함께 리뷰 작성, 신고 가능 횟수를 업데이트 합니다.
  const patchBuyerInfo = async () => {
    const sellData = {
      roomId: id,
    };
    try {
      const response = await axios.patch(
        `${ENV_URL}chatRoom/:id/patchBuyerInfo`,
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

  // SB: 파일 전송 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('image', image);
    formData.append('roomId', id);

    if (!image) {
      onModalToggle();
      setModalType('파일을 업로드 해주세요!');
    } else {
      try {
        const response = await axios.post(
          `${ENV_URL}chatRoom/:id/sendFile`,
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

  // SB: socket으로 받은 파일 url을 useState로 저장하는 함수
  const fileReceive = useCallback((res) => {
    setImagePath(res.imagePath);
  }, []);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  // SB: 상품 받기 버튼 함수
  const getFile = async () => {
    try {
      const response = await axios.get(
        `${ENV_URL}chatRoom/:id/getFile?roomId=${id}`
      );

      setImagePath(response.data);
    } catch (error) {
      console.error('Get File Error:', error);
    }
  };

  useEffect(() => {
    getBoardInfo();
  }, [memberId]);

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

  useEffect(() => {
    socket.on('notice', notice);
    return () => socket.off('notice', notice);
  }, [notice]);

  useEffect(() => {
    getChatText();
  }, [otherMemberId]);

  useEffect(() => {
    socket.on('chat', addChatList);
    return () => socket.off('chat', addChatList);
  }, [addChatList]);

  useEffect(() => {
    socket.on('transactionNotice', addChatNotice);
    return () => socket.off('transactionNotice', addChatNotice);
  }, [addChatNotice]);

  useEffect(() => {
    return () => {
      socket.emit('disconnection', { roomName: roomName, userDo: userDo });
    };
  }, []);

  useEffect(() => {
    socket.on('stateReceive', stateReceive);
  }, [chatState]);

  useEffect(() => {
    socket.on('sellConfirmed', sellConfirmed);
    return () => socket.off('sellConfirmed', sellConfirmed);
  }, [sellConfirmed]);

  useEffect(() => {
    socket.on('fileReceive', fileReceive);
  }, [fileReceive]);

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
                      src={`${ENV_URL}static/userImg/${encodeURIComponent(boardInfo.image)}`}
                      alt="board img"
                    />
                  </div>
                  <div className="chattingBoardOne">
                    <div className="chattingBoardTitle">{boardInfo.title}</div>
                    <div className="chattingBoardPrice">
                      {boardInfo.price}원
                    </div>
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
                      <button onClick={() => handleAction('wantBuy')}>구매 요청</button>
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
                      <button onClick={() => handleAction('sell')}>판매 확정</button>
                      <button onClick={() => handleAction('sellCancel')}>판매 취소</button>
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
                      <button onClick={() => handleAction('buy')}>구매 확정</button>
                      <button onClick={() => handleAction('buyCancel')}>구매 취소</button>
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
                      <button onClick={() => handleAction('downloadFile')}>상품 받기</button>
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