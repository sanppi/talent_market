import { useState, useEffect } from 'react';
import useToggle from './hook/UseToggle';
import ModalBasic from './ModalBasic';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function ModalAccount({ setToggleState }) {
  const [bankData, setBankData] = useState(null);
  const [accountNum, setAccountNum] = useState('');
  const [logo, onLogo] = useToggle(false);
  const [modal, onModal] = useToggle(false);
  const [msg, setMsg] = useState('');
  const memberId = useSelector((state) => state.auth.memberId);

  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const response = await fetch('/bank.json');
        const data = await response.json();

        setBankData(data);
      } catch (err) {
        console.error('은행 정보 에러:', err);
      }
    };

    fetchBankData();
  }, []);

  const disableModal = () => {
    setToggleState();
  };

  const handleAccount = async () => {
    if (!accountNum) {
      setMsg('계좌번호를 입력해 주세요.');
    } else {
      setMsg('');
      onLogo();
    }
  };

  const handleBank = async (bank) => {
    try {
      if (!accountNum) {
        setMsg('계좌번호를 입력해 주세요.');
      } else {
        const userData = { bankName: bank.name, accountNum: accountNum };
        const response = await axios({
          url: `${process.env.REACT_APP_DB_HOST}member/mypage/update/payRegister/${memberId}`,
          method: 'post',
          data: userData,
        });

        if (response.data.result) {
          setToggleState();
          // TODO : 등록되었습니다 모달 왜 안 나옴
          onModal();
        }
      }
    } catch (err) {
      console.log('err: ', err);
    }
  };

  return (
    <>
      <div className="modalContainer">
        <div className="modalExitWrapper" onClick={disableModal}>
          &times;
        </div>
        <div className="modalWrapper">
          <div className="accountBox">
            <div className="accountSelect">
              <div className="bankSelect">결제계좌 등록</div>
              <input
                className="accountNumber"
                type="number"
                onChange={(e) => setAccountNum(e.target.value)}
                placeholder="계좌번호"
              />
              <div className="accountButton" onClick={handleAccount}>
                입력
              </div>
              <small role="alert">
                {/* 토글이 true이거나 accountNum에 값 있으면*/}
                {msg}
              </small>
            </div>
          </div>
          <ul>
            {logo &&
              bankData?.banks?.map((bank) => (
                <li key={bank.name} onClick={() => handleBank(bank.name)}>
                  <img
                    src={`${bankData.logoBasePath}${bank.logoPath}`}
                    alt={`${bank.name} 로고`}
                  />
                  <span>{bank.name}</span>
                </li>
              ))}
            {modal && <ModalBasic content="등록" />}
          </ul>
        </div>
      </div>
    </>
  );
}
