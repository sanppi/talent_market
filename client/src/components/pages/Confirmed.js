export default function Confirmed({ chat }) {
  return (
    <>
      <div className={`chattingText Chat`}>
        <div className="content">
          {chat.content}
        </div>
      </div>
    </>
  );
}
