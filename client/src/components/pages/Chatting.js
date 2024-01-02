import '../../styles/chat.css';
import { useEffect, useState } from 'react';
import ChattingRoomList from './ChattingRoomList';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io.connect('http://localhost:8000', { autoConnect: false });
export default function Chatting() {
  const [memberId, setMemberId] = useState(null)
  const [nickname, setNickname] = useState(null)
  const [chattingRoomList, setChattingRoomList] = useState([]);

  useEffect(() => {
    // 서버로부터 로그인 세션 정보를 가져오는 요청을 보냅니다.
    axios.get(`${process.env.REACT_APP_DB_HOST}chatting/getSessionInfo`, { 
      withCredentials: true
    }).then((response) => {
      setMemberId(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  const userCheck = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatting/userCheck?memberId=${memberId}`,
        // `${process.env.REACT_APP_DB_HOST}chatting/userCheck?memberId=1`,
      );

      console.log("response.data.nickname", response.data.nickname)
      setNickname(response.data.nickname)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getRoomList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatting/getRoomList?memberId=${memberId}`,
        // `${process.env.REACT_APP_DB_HOST}chatting/getRoomList?memberId=1`,
      );

      if (response.data) {
              console.log("response.data", response.data)
      setChattingRoomList(prevList => [
        ...prevList,
        ...response.data
      ]);
      } else {
        console.error('Get Room List Server Error:');
        alert("현재 사용하는 채팅방이 없습니다.");
      }

    } catch (error) {
      console.error('Get Room List Error:', error);
    }
  };

  useEffect(() => {
    if (memberId !== null) {
      userCheck();
      getRoomList();
    }
  }, [memberId]);


  return (
    <>
      { memberId ? (
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
    </>
  );
}
  