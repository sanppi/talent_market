import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export default function ChattingRoomList({ chattingRoom, setChattingRoomList }) {
  const [roomId, setRoomId] = useState(null);

  const handleSetRoomId = () => {
    setRoomId(chattingRoom.roomId);
  };

  useEffect(() => {
    if (roomId !== null) {
      deleteRoom();
    }
  }, [roomId]);

  const deleteRoom = async () => {
    try {
      const data = { roomId: roomId }
      const response = await axios.delete(
        `${process.env.REACT_APP_DB_HOST}chatting/deleteRoom`,
        {
          data,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      setChattingRoomList()
      window.location.reload();
      
      // 리더님 이거 새로고침말고 더 나은 방법 있을까요?
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ backgroundColor: 'pink', marginBottom: '10px' }}>
      <Link to={`/chatRoom/${chattingRoom.roomId}`}>{chattingRoom.roomName}/{chattingRoom.title}</Link>
      <button onClick={handleSetRoomId}>채팅방 나가기</button>
      <button >신고하기</button>
    </div>
  );
}