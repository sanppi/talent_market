export default function SignInInput({
  type,
  id,
  label,
  register,
  value,
  isMsg,
  msg,
}) {
  return (
    <>
      <div className="signInput">
        <label htmlFor={id}>{label}</label>
        <input type={type} id={id} {...register(id)} value={value} />
      </div>
    </>
  );
}
