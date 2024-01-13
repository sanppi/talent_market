import '../../styles/chat.scss';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';
import ModalBasic from '../ModalBasic';
import ChattingRoomList from './ChattingRoomList';
import useToggle from '../hook/UseToggle';


function Chatting({ user }) {
  const { memberId, nickname } = user; // reduc 사용자의 memberId와 nickname을 추출
  const navigate = useNavigate(); // React Router의 navigate 함수를 사용하여 페이지 이동을 관리

  const [chattingRoomList, setChattingRoomList] = useState([]); // 채팅방 목록을 저장하는 상태와 해당 상태를 업데이트하는 함수

  const [modalToggle, onModalToggle] = useToggle(false); // 모달의 토글 상태를 저장하는 상태와 해당 상태를 업데이트하는 함수
  const [modalType, setModalType] = useState(''); // 모달의 텍스트을 저장하는 상태와 해당 상태를 업데이트하는 함수

  const getAllRoomList = async () => {
    try {
      // memberId를 기반으로 API를 호출하여 구매 채팅방 목록을 가져옴
      const buyResponse = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatting/getBuyRoomList?memberId=${memberId}`
      );

      // memberId를 기반으로 API를 호출하여 판매 채팅방 목록을 가져옴
      const sellResponse = await axios.get(
        `${process.env.REACT_APP_DB_HOST}chatting/getSellRoomList?memberId=${memberId}`
      );

      // 채팅방이 없는 경우에 대한 처리 추가
      if (buyResponse.data.length === 0 && sellResponse.data.length === 0) {
        onModalToggle(); // 모달을 토글하여 표시
        setModalType('현재 사용하는 채팅방이 없습니다.'); // 모달의 타입을 설정
        return;
      }

      // 구매 채팅방 목록과 판매 채팅방 목록을 합침
      const allData = [...buyResponse.data, ...sellResponse.data];

      // 채팅방 목록을 최신 생성일자 순으로 정렬
      const sortedData = allData.sort((a, b) => {
        const dateA = new Date(a.latestCreatedAt);
        const dateB = new Date(b.latestCreatedAt);
        return dateB - dateA;
      });

      // 정렬된 채팅방 목록을 설정
      setChattingRoomList(sortedData);
    } catch (error) {
      console.error('Get Room List Error:', error);
    }
  };

  useEffect(() => {
    if (memberId) {
      getAllRoomList(); // memberId가 존재할 경우 getAllRoomList 함수 호출하여 채팅방 목록 가져옴
    } else {
      navigate('/member/signin'); // memberId가 없을 경우 로그인 페이지로 이동
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
                  />
                </>
              ))}
            </div>
          </div>
        </div>
      )}
      {modalToggle && (
        <ModalBasic
          type="confirm"
          content={modalType}
          toggleState={true}
          setToggleState={onModalToggle}
        />
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