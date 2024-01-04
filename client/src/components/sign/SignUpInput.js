export default function SignUpInput({
  label,
  type,
  id,
  register,
  onChange,
  msg,
  value,
  error,
  hasButton,
  onButtonClick,
  validation,
  isUpdate,
  placeholder,
}) {
  return (
    <div className="signInput">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        {...register(id, validation)}
        onChange={(e) => onChange(id, e.target.value)}
        value={value}
        placeholder={placeholder}
      />
      {hasButton ? (
        <>
          {isUpdate ? (
            <>
              <button
                className="updateButton"
                type="button"
                onClick={() => onButtonClick(id)}
              >
                {label} 변경
              </button>
            </>
          ) : (
            <>
              <span role="alert">{msg[`${id}Duplicate`]}</span>
              <button type="button" onClick={() => onButtonClick(id)}>
                {label} 중복 확인
              </button>
            </>
          )}
        </>
      ) : (
        ''
      )}
      {error && <small role="alert">{error.message}</small>}
    </div>
  );
}
