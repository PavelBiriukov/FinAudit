import React from 'react';
import './Textarea.css';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export const Textarea = ({ label, error, id, ...props }: TextareaProps) => {
  const textareaId = id ?? `textarea-${label}`;

  return (
    <div className="field">
      <label className="field__label" htmlFor={textareaId}>
        {label}
      </label>

      <textarea
        id={textareaId}
        className={`field__textarea ${error ? 'field__textarea--error' : ''}`}
        {...props}
      />

      {error ? <span className="field__error">{error}</span> : null}
    </div>
  );
};