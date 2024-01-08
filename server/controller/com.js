const getAllRoomList = async () => {
  try {
    const buyResponse = await axios.get(
      `${process.env.REACT_APP_DB_HOST}chatting/getBuyRoomList?memberId=${memberId}`,
    );
    
    const sellResponse = await axios.get(
      `${process.env.REACT_APP_DB_HOST}chatting/getSellRoomList?memberId=${memberId}`,
    );

    // 채팅방이 없는 경우에 대한 처리 추가
    if (buyResponse.data.length === 0 && sellResponse.data.length === 0) {
      alert("현재 사용하는 채팅방이 없습니다.");
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
