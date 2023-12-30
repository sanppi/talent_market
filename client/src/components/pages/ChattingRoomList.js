import { Link } from "react-router-dom";

export default function ChattingRoomList({ chattingRoom }) {
    return (
      <div style={{ backgroundColor: 'pink', marginBottom: '10px' }}>
        <Link to={`/chatRoom/${chattingRoom.roomId}`}>{chattingRoom.roomName}/{chattingRoom.title}</Link>
      </div>
    );
  }
  