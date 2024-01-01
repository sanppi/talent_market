export default function Chat({ chat }) {
  return (
    <>
      <div className={`list ${chat.type}-chat`}>
        <div>{chat.type}{chat.nickname}</div>
        <div className="content">{chat.content}</div>
      </div>
    </>
  );
}
