export default function Confirmed({ chat }) {
    return (
    <>
      <div className={`list ${chat.subType}-chat`}>
        <div>{chat.nickname}</div>
        <div className="content">계좌번호: {chat.content} 결제금액: {chat.price} 결제 후 구매 확정 버튼을 눌러주세요.</div>
      </div>
    </>
    )
  }
  