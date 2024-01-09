import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export default function ChattingRoomList({ chattingRoom, setChattingRoomList, removeChattingRoom }) {
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
      removeChattingRoom(); // removeChattingRoom 함수 호출
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // window.onbeforeunload = function() {
  //   console.log("out1")
  // };

  // useEffect(() => {
  //   if (window.performance && window.performance.navigation.type === 2) {
  //     console.log("out1")
  //   }
  //   window.onbeforeunload = function() {
  //     console.log("out1")
  //   };
  // }, []);

  return (
    <div style={{ backgroundColor: 'pink', marginBottom: '10px' }}>
      <Link to={`/chatRoom/${chattingRoom.roomId}`}>{chattingRoom.roomName}/{chattingRoom.title}</Link>
      <button onClick={handleSetRoomId}>채팅방 나가기</button>
      <button >신고하기</button>
    </div>
  );
}