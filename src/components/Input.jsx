import React from 'react';
import './Input.css';

const Input = ({ 
  label, 
  type = 'text', 
  id, 
  name, 
  value, 
  onChange, 
  required = false,
  placeholder = '',
  min,
  max,
  step,
  rows,
  options,
  ...props 
}) => {
  const renderInput = () => {
    if (type === 'select') {
      return (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={rows}
          {...props}
        />
      );
    }

    return (
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        {...props}
      />
    );
  };

  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      {renderInput()}
    </div>
  );
};

export default Input; 