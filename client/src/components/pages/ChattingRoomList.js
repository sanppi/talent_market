import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export default function ChattingRoomList({ chattingRoom }) {
  const [roomId, setRoomId] = useState(null)

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
      console.log("dataaaaaaaaaaaaaaaaaaa", data);
      const response = await axios.delete(
        `${process.env.REACT_APP_DB_HOST}chatting/deleteRoom`,
        {
          data,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      console.log(response);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ backgroundColor: 'pink', marginBottom: '10px' }}>
      <Link to={`/chatRoom/${chattingRoom.roomId}`}>{chattingRoom.roomName}/{chattingRoom.title}</Link>
      <button onClick={handleSetRoomId}>채팅방 나가기</button>
      <button>신고하기</button>
    </div>
  );
}