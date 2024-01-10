import React, { useEffect, useState } from 'react';
import ChattingRoomList from './ChattingRoomList';
import axios from 'axios';
import { connect } from 'react-redux';
import Footer from './Footer';
import '../../styles/chat.scss';
import { useNavigate } from 'react-router-dom';

function Chatting({ user }) {
  const { memberId, nickname } = user;
  const navigate = useNavigate();

  const [chattingRoomList, setChattingRoomList] = useState([]);

  const getAllRoomList = async () => {
    try {
      const buyResponse = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatting/getBuyRoomList?memberId=${memberId}`
      );

      const sellResponse = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatting/getSellRoomList?memberId=${memberId}`
      );

      // 채팅방이 없는 경우에 대한 처리 추가
      if (buyResponse.data.length === 0 && sellResponse.data.length === 0) {
        alert('현재 사용하는 채팅방이 없습니다.');
        return;
      }

      const allData = [...buyResponse.data, ...sellResponse.data];

      const sortedData = allData.sort((a, b) => {
        const dateA = new Date(a.latestCreatedAt);
        const dateB = new Date(b.latestCreatedAt);
        return dateB - dateA;
      });

      setChattingRoomList(sortedData);
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
    if (memberId) {
      getAllRoomList();
    } else {
      navigate('/member/signin');
    }
  }, [memberId]);

  return (
    <>
      {memberId && (
        <div className="chatContainer slideIn">
          <div className="chatListBox">
            <div className="chatTitle"> {nickname}님의 채팅 목록</div>
            <div className="chatList">
              {chattingRoomList.map((chattingRoom, i) => (
                <>
                  <div className="hiddenLine"></div>
                  <ChattingRoomList
                    key={i}
                    chattingRoom={chattingRoom}
                    setChattingRoomList={setChattingRoomList}
                    removeChattingRoom={() => removeChattingRoom(i)} // 특정 목록 제거 함수 전달
                  />
                </>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth,
});

const ConnectedChatting = connect(mapStateToProps)(Chatting);

export default ConnectedChatting;
