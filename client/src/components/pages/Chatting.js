import '../../styles/chat.css';
import { useEffect, useState } from 'react';
import ChattingRoomList from './ChattingRoomList';
import axios from 'axios';
import { connect } from 'react-redux';

function Chatting({ user }) {
  const { memberId, nickname } = user;

  const [chattingRoomList, setChattingRoomList] = useState([]);

  const getAllRoomList = async () => {
    try {
      const buyResponse = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatting/getBuyRoomList?memberId=${memberId}`,
      );
      
      const sellResponse = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatting/getSellRoomList?memberId=${memberId}`,
      );
  
      if (buyResponse.data && sellResponse.data) {
        const allData = [...buyResponse.data, ...sellResponse.data];
  
        const sortedData = allData.sort((a, b) => {
          const dateA = new Date(a.latestCreatedAt);
          const dateB = new Date(b.latestCreatedAt);
          return dateB - dateA;
        });
  
        setChattingRoomList(sortedData);
      } else {
        console.error('Get Room List Server Error');
        alert("현재 사용하는 채팅방이 없습니다.");
      }
  
    } catch (error) {
      console.error('Get Room List Error:', error);
    }
  };
  

  useEffect(() => {
    if (memberId !== null) {
      getAllRoomList();
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
                <div>
                  <ChattingRoomList key={i} chattingRoom={chattingRoom} setChattingRoomList= {setChattingRoomList}/>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (<></>) }
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth,
});

const ConnectedChatting = connect(mapStateToProps)(Chatting);

export default ConnectedChatting;