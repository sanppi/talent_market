export default function SignForm({ type }) {
  return (
    <>
      <div className="signup-form">
        <div className="signup-input-form">
          <div className="signup-input">
            <label htmlFor="userid">아이디</label>
            <input type="text" placeholder="아이디" />
          </div>
          <div className="signup-input">
            <label htmlFor="pw">비밀번호</label>
            <input type="password" placeholder="비밀번호" />
          </div>
          {type === 'signup' && (
            <>
              <div className="signup-input">
                <label htmlFor="pwcheck">비밀번호 확인</label>
                <input type="password" placeholder="비밀번호 확인" />
              </div>
              <div className="signup-input">
                <label htmlFor="nickname">닉네임</label>
                <input type="text" placeholder="닉네임" />
              </div>
              <div className="signup-input">
                <label htmlFor="email">이메일</label>
                <input type="email" placeholder="이메일" />
              </div>
              <div className="signup-input">
                <label htmlFor="account">계좌번호</label>
                <input
                  type="number"
                  placeholder="(option) 판매글 등록시 필요한 정보입니다."
                />
              </div>
              <div>로그인하러 가기</div>
            </>
          )}
        </div>
        <button type="button" className="signup-button">
          회원가입
        </button>
        {/* <Link to=""/> */}
      </div>
    </>
  );
}
