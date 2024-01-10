import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ChattingRoomList({
  chattingRoom,
  setChattingRoomList,
  removeChattingRoom,
}) {
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
      const data = { roomId: roomId };
      const response = await axios.delete(
        `${process.env.REACT_APP_DB_HOST}chatting/deleteRoom`,
        {
          data,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      removeChattingRoom(); // removeChattingRoom 함수 호출
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="chatRoomList">
      <div className="chatProfile pattern"></div>
      <Link className="chatRoom" to={`/chatRoom/${chattingRoom.roomId}`}>
        <div className="chatRoomTitle">{chattingRoom.title}</div>
        <div className="chatRoomName">{chattingRoom.roomName}</div>
      </Link>
      {/* TODO : chattingRoom의 canRedCard가 양수일 때만 신고하기 on */}
      <button className="chatRedCard">🚨</button>
    </div>
  );
}
