import '../../styles/chat.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Chat from './Chat';
import Notice from './Notice';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io.connect('http://localhost:8000', { autoConnect: false });
export default function Chatting() {
  const [id, setId] = useState("example_id")
  const [nickname, setNickname] = useState("")
  const [msgInput, setMsgInput] = useState('');
  const [userIdInput, setUserIdInput] = useState('');
  const [chatList, setChatList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userList, setUserList] = useState({});

  const userCheck = async (e) => {
    if (id === '') {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/chatting/userCheck?id=${id}`,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log(response.data.nickname);
      setNickname(response.data.nickname)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const entryChat = () => {
    // initSocketConnect();
    // socket.emit('entry', { userId: userIdInput });
    userCheck();
  };










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

  const addChatList = useCallback(
    (res) => {
      const type = res.userId === userId ? 'my' : 'other';
      const content = `${res.userId}: ${res.msg}`;
      const newChatList = [...chatList, { type: type, content: content }];
      setChatList(newChatList);
    },
    [userId, chatList]
  );

  useEffect(() => {
    socket.on('chat', addChatList);
    return () => socket.off('chat', addChatList);
  }, [addChatList]);

  useEffect(() => {
    const notice = (res) => {
      const newChatList = [...chatList, { type: 'notice', content: res.msg }];
      setChatList(newChatList);
    };

    socket.on('notice', notice);
    return () => socket.off('notice', notice);
  }, [chatList]);

  const sendMsg = () => {
    if (msgInput !== '') {
      socket.emit('sendMsg', { userId: userId, msg: msgInput });
      setMsgInput('');
    }
  };



  return (
    <>
      {nickname ? (
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
          <div className="input-container">
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
            />
            {/* <button onClick={entryChat}>입장</button> */}
            <button onClick={entryChat}>구매하기</button>
          </div>
        </>
      )}
    </>
  );
}
