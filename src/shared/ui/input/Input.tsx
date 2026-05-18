import React, { forwardRef } from 'react';
import './Input.css';

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string;
  error?: string;
};

const normalizeId = (value: string) =>
  value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, name, ...props }, ref) => {
    const inputId = id ?? (name ? `input-${normalizeId(name)}` : `input-${normalizeId(label)}`);

    return (
      <div className="field">
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>

        <input
          ref={ref}
          id={inputId}
          name={name}
          className={`field__input ${error ? 'field__input--error' : ''}`}
          {...props}
        />

        {error ? <span className="field__error">{error}</span> : null}
      </div>
    );
  },
);

Input.displayName = 'Input';