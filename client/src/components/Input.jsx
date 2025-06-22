function Input({ type, label, id, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="input-field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        className="input-field"
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}

export default Input;
