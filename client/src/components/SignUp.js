import '../styles/signup.scss';

export default function SignUp() {
  return (
    <>
      <div className="signup-form">
        <div>
          <div className="signup-input">
            <input type="text" placeholder="아이디" />
          </div>
          <div className="signup-input">
            <input type="text" placeholder="닉네임" />
          </div>
          <div className="signup-input">
            <input type="text" placeholder="비밀번호" />
          </div>
          <div className="signup-input">
            <input type="email" placeholder="이메일" />
          </div>
          <div className="signup-input">
            <input type="number" placeholder="판매할 때 등록 가능합니다." />
          </div>
        </div>
        <button>회원가입</button>
        {/* <Link to=""/> */}
      </div>
    </>
  );
}
