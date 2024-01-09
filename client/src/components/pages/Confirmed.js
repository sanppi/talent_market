export default function Confirmed({ chat }) {
    return (
    <>
      <div className="list">계좌번호: {chat.content}</div>
      <div className="list">결제금액: {chat.price}</div>
      <div>결제 후 구매 확정 버튼을 눌러주세요.</div>
    </>
    )
  }
  