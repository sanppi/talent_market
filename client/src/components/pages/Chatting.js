import '../../styles/chat.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ChattingRoomList from './ChattingRoomList';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io.connect('http://localhost:8000', { autoConnect: false });
export default function Chatting() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const [memberId, setMemberId] = useState("1")
  const [id, setId] = useState("seobon")
  const [nickname, setNickname] = useState("")
  const [chattingRoomList, setChattingRoomList] = useState([]);


  const [userIdInput, setUserIdInput] = useState('');
  const [userId, setUserId] = useState(null);
  const [userList, setUserList] = useState({});
  

  useEffect(() => {
    // 서버로부터 로그인 세션 정보를 가져오는 요청을 보냅니다.
    axios.get("http://localhost:8000/chatting/getSessionInfo").then((response) => {
        const data = response.data;
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user);
        // console.log("hey");
        // console.log(data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  useEffect( async () => {
    if (memberId === '') {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/chatting/userCheck?memberId=${memberId}`,
      );

      setNickname(response.data.nickname)
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);


  useEffect( async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/chatting/getRoomList?memberId=${memberId}`,
      );

      for(let i = 0; i < response.data.length; i++) {
        setChattingRoomList(prevList => [
          ...prevList,
          { roomId: response.data[i].roomId, roomName: response.data[i].roomName, title: response.data[i].title }
          // 리더님 response.data도 배열인데 왜 바로 데이터를 넣을 순 없는 걸까요
        ])
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);
  
  useEffect(() => {
    console.log(chattingRoomList[0]);
  }, [chattingRoomList]);







  const initSocketConnect = () => {
    // console.log('connected', socket.connected);
    if (!socket.connected) socket.connect();
  };

  useEffect(() => {
    socket.on('error', (res) => {
      alert(res.msg);
    });

    socket.on('entrySuccess', (res) => {
      setUserId(res.userId);
    });

    socket.on('userList', (res) => {
      setUserList(res);
    });
  }, []);

  const userListOptions = useMemo(() => {
    const options = [];
    for (const key in userList) {
      if (userList[key] === userId) continue;
      options.push(
        <option key={key} value={key}>
          {userList[key]}
        </option>
      );
    }
    return options;
  }, [userList]);









  return (
    <>
     { id ? (
      <>
        <div> {nickname}님의 채팅방</div>
        <div>
          <div>
            {chattingRoomList.map((chattingRoom, i) => (
              <ChattingRoomList key={i} chattingRoom={chattingRoom}/>
            ))}
          </div>
        </div>
      </>

      ) : (<></>) }

      
      {/* {nickname ? (
        <>
          <div>{nickname}님 환영합니다.</div>
          <div className="chat-container">
            {chatList.map((chat, i) => {
              if (chat.type === 'notice') return <Notice key={i} chat={chat} />;
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
        </>
      ) : (
        <>
          <div className="input-container"> */}
            {/* <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
            /> */}
            {/* <button onClick={entryChat}>입장</button> */}
            {/* <button onClick={entryChat}>구매하기</button>
          </div>
        </>
      )} */}
      {/* <div> */}
        {/* 세션 정보를 사용하는 내용을 여기에 작성합니다 */}
        {/* <button onClick={entryChat}>구매하기</button>
        {isAuthenticated ? (
          <div>
            <p>사용자가 인증되었습니다.</p>
            <p>사용자 이름: {user?.name}</p>
          </div>
        ) : (
          <p>사용자가 인증되지 않았습니다.</p>
        )}
      </div> */}
    </>
  );
}
