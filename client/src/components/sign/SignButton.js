import '../../styles/signbutton.scss';
import { Link } from 'react-router-dom';

export default function SignButton({ disabled, onClick, onKeyDown, type }) {
  return (
    <>
      <div className="signButtonBox">
        <button
          type="submit"
          className="signButton"
          disabled={disabled}
          onKeyDown={onKeyDown}
          onClick={onClick}
        >
          {type}
        </button>
        {type === '로그인' && (
          <div>
            <Link to="/member/signup">계정이 없으신가요?</Link>
          </div>
        )}
      </div>
    </>
  );
}
