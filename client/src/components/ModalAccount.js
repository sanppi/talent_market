import { useState, useEffect } from 'react';
import useToggle from './hook/UseToggle';
import ModalBasic from './ModalBasic';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function ModalAccount({
  setToggleState,
  setAccountInfo,
  accountInfo,
}) {
  const [bankData, setBankData] = useState(null);
  const [accountNum, setAccountNum] = useState('');
  const [logo, onLogo] = useToggle(false);
  const [modal, onModal] = useToggle(false);
  const [msg, setMsg] = useState('');
  const [doneMsg, setDoneMsg] = useState('');
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

  // 결제정보 등록
  const handleBank = async (bank) => {
    try {
      if (!accountNum) {
        setMsg('계좌번호를 입력해 주세요.');
      } else {
        const userData = { bankName: bank, accountNum: accountNum };
        const response = await axios({
          url: `${process.env.REACT_APP_DB_HOST}member/mypage/update/payRegister/${memberId}`,
          method: 'post',
          data: userData,
        });

        if (response.data.result) {
          setDoneMsg(response.data.message);
          onModal();
          setTimeout(() => {
            setToggleState((prevState) => !prevState);
          }, 2000);
        }
      }
    } catch (err) {
      console.log('err: ', err);
    }
  };

  return (
    <>
      <div className="modalContainer slideIn">
        <div className="modalExitWrapper" onClick={disableModal}>
          &times;
        </div>
        {accountInfo ? (
          <>
            <div className="setAccountBox">
              <div className="setAccountBank">
                <h5>은행명</h5>
                <span>{accountInfo.bankName}</span>
              </div>
              <div className="setAccountNum">
                <h5>계좌번호</h5>
                <span>{accountInfo.accountNum}</span>
              </div>
              <button
                onClick={() => setAccountInfo(null)}
                className="setAccountBtn"
              >
                수정
              </button>
            </div>
          </>
        ) : (
          <div className="modalWrapper">
            <div className="accountBox">
              <div className="accountSelect">
                <div className="bankSelect">결제계좌 등록</div>
                <div className="accountBox">
                  <input
                    className="accountNumber"
                    type="number"
                    onChange={(e) => setAccountNum(e.target.value)}
                    placeholder="계좌번호만 입력"
                  />
                  <div className="accountButton" onClick={handleAccount}>
                    입력
                  </div>
                </div>
                <small role="alert">{msg}</small>
              </div>
            </div>
            <ul>
              {logo &&
                bankData?.banks?.map((bank) => {
                  return (
                    <li key={bank.name} onClick={() => handleBank(bank.name)}>
                      <img
                        src={`/${encodeURIComponent(
                          bankData.logoBasePath + bank.logoPath
                        )}`}
                        alt={`/${encodeURIComponent(
                          bankData.logoBasePath + bank.logoPath
                        )} 로고`}
                      />
                      <span>{bank.name}</span>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
      {modal && (
        <ModalBasic
          type="confirm"
          content={doneMsg}
          toggleState={true}
          setToggleState={onModal}
        />
      )}
      <div className="modalCanvas" onClick={disableModal}></div>
    </>
  );
}
