export default function SignInInput({ type, id, label, register, value }) {
  return (
    <>
      <div className="signInput">
        <label htmlFor={id}>{label}</label>
        <input type={type} id={id} {...register(id)} value={value} />
      </div>
    </>
  );
}
