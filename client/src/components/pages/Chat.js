export default function Chat({ chat }) {
  return (
    <>
      <div className={`chattingText ${chat.type}Chat`}>
        <div>{chat.nickname}</div>
        <div className="chatContent">{chat.content}</div>
      </div>
    </>
  );
}
