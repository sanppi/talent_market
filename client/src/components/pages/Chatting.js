import React, { useEffect, useState } from 'react';
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
  
  const removeChattingRoom = (roomIndex) => {
    // 특정 목록을 제거하는 함수
    const updatedRoomList = [...chattingRoomList];
    updatedRoomList.splice(roomIndex, 1);
    setChattingRoomList(updatedRoomList);
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
                  <ChattingRoomList
                    key={i}
                    chattingRoom={chattingRoom}
                    setChattingRoomList={setChattingRoomList}
                    removeChattingRoom={() => removeChattingRoom(i)} // 특정 목록 제거 함수 전달
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (<div>로그인인이 필요한 서비스입니다.</div>) }
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth,
});

const ConnectedChatting = connect(mapStateToProps)(Chatting);

export default ConnectedChatting;
