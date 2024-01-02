import '../../styles/chat.css';
import { useEffect, useState } from 'react';
import ChattingRoomList from './ChattingRoomList';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io.connect('http://localhost:8000', { autoConnect: false });
export default function Chatting() {
  const [user, setUser] = useState(null);

  // 세션 기능 확인 후, 수정 예정 코드
  const [memberId, setMemberId] = useState("1")

  const [nickname, setNickname] = useState(null)
  const [chattingRoomList, setChattingRoomList] = useState([]);


  useEffect(() => {
    // 서버로부터 로그인 세션 정보를 가져오는 요청을 보냅니다.
    axios.get("http://localhost:8000/chatting/getSessionInfo", { 
      withCredentials :true
    }).then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  const userCheck = async() => {
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
  };

  const getRoomList = async() => {
    try {
      const response = await axios.get(
        `http://localhost:8000/chatting/getRoomList?memberId=${memberId}`,
      );

      setChattingRoomList(prevList => [
        ...prevList,
        ...response.data
      ])
    } catch (error) {
      console.error('Get Room List Error:', error);
    }
  };

  useEffect(() => {
    userCheck();
    getRoomList()
  },[])

  return (
    <>
      { nickname ? (
        <>
          <div> {user}님의 채팅방</div>
          <div>
            <div>
              {chattingRoomList.map((chattingRoom, i) => (
                <ChattingRoomList key={i} chattingRoom={chattingRoom}/>
              ))}
            </div>
            <button>채팅방 생성</button>
            <button>채팅방 삭제</button>
            <button>채팅방 업데이트</button>
          </div>
        </>
      ) : (<></>) }
    </>
  );
}
