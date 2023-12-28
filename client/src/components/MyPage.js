import { Link } from 'react-router-dom';
import '../styles/mypage.scss';

export default function MyPage() {
  // 수정할 때 필요한 state
  //   const [editing, setEditing] = useState('');
  //   const [editNickname, setEditNickname] = useState('');
  //   const [editText, setEditText] = useState('');

  return (
    <>
      <div className="myPage">
        <div className="myProfileContainer">
          <div className="myProfileBox1">
            <div className="myProfileImg">
              <img src="" alt="" />
            </div>
            <button>
              <Link to="/member/mypage/update">회원 정보 수정</Link>
            </button>
          </div>
          <div className="myProfileBox2">
            <div className="myProfileNickname">닉네임</div>
            <div className="myProfileDescription">
              소개글
              <button>수정</button>
            </div>
          </div>
        </div>
        <div className="myList">
          <ul>
            <li>찜한 목록</li>
            <li>나의 판매상품</li>
            <li>후기</li>
          </ul>
        </div>
      </div>
    </>
  );
}
