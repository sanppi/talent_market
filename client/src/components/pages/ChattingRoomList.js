// SB: 채팅 목록칸을 보여주는 파일입니다.
import { Link } from 'react-router-dom';

export default function ChattingRoomList({ chattingRoom}) {
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
