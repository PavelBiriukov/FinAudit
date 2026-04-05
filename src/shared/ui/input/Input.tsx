import React from 'react';
import './Input.css';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = ({ label, error, id, ...props }: InputProps) => {
  const inputId = id ?? `input-${label}`;

  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>

      <input
        id={inputId}
        className={`field__input ${error ? 'field__input--error' : ''}`}
        {...props}
      />

      {error ? <span className="field__error">{error}</span> : null}
    </div>
  );
};