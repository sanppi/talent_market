// ChatRoom.js
{
  /* <div
className="container text-center"
style={{ backgroundColor: "lightyellow", marginBottom: "10px" }}
>
<div className="row">
  <div className="col">
    <button onClick={exitRoom}>뒤로가기</button>
  </div>
  <div className="col">{boardInfo.image}</div>
  <div className="col-6">
    <div>{boardInfo.title}</div>
    <div>{boardInfo.price}</div>
    <div>{boardInfo.starAvg}</div>
  </div>
  <div className="col">
    <div>{boardInfo.sellerNickname}</div>
  </div>
</div>
<div className="chat-container">
  {chatList.map((chat, i) => {
    if (chat.type === "notice") return <Notice key={i} chat={chat} />;
    else if (chat.type === "confirmed")
      return <Confirmed key={i} chat={chat} />;
    else return <Chat key={i} chat={chat} />;
  })}
  <div>
    {userDo === "판매" ? (
      chatState === "ready" ? (
        <div>
          <button onClick={sell}>판매 확정</button>
          <button onClick={sellCancel}>판매 취소</button>
        </div>
      ) : chatState === "sale" ? (
        <></>
      ) : (
        <div>
          <button onClick={sellCheck}>확인 완료</button>
        </div>
      )
    ) : chatState === "sale" ? (
      <div>
        <button onClick={buy}>구매 확정</button>
        <button onClick={buyCancel}>구매 취소</button>
      </div>
    ) : (
      <></>
    )}
  </div>
</div>
<div className="input-container">
  <input
    type="text"
    value={msgInput}
    onChange={(e) => setMsgInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        sendMsg();
      }
    }}
  />
  <button onClick={sendMsg}>전송</button> */
}
