import { useState, useEffect } from 'react';

export default function ModalAccount({ setToggleState }) {
  const [bankData, setBankData] = useState(null);

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

  return (
    <>
      <div className="modalContainer">
        <div className="modalExitWrapper" onClick={disableModal}>
          &times;
        </div>
        <div className="modalWrapper">
          <ul>
            {/* input이 먼저 나오고, 클릭하면 모달! */}
            {bankData?.banks?.map((bank) => (
              <li key={bank.name}>
                <img
                  src={`${bankData.logoBasePath}${bank.logoPath}`}
                  alt={`${bank.name} 로고`}
                />
                <span>{bank.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
