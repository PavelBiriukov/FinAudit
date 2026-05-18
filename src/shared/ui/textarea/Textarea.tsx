import React, { forwardRef } from 'react';
import './Textarea.css';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

const normalizeId = (value: string) =>
  value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, name, ...props }, ref) => {
    const textareaId =
      id ?? (name ? `textarea-${normalizeId(name)}` : `textarea-${normalizeId(label)}`);

    return (
      <div className="field">
        <label className="field__label" htmlFor={textareaId}>
          {label}
        </label>

        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          className={`field__textarea ${error ? 'field__textarea--error' : ''}`}
          {...props}
        />

        {error ? <span className="field__error">{error}</span> : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';