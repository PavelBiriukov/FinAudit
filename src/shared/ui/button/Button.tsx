import React from 'react';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = ({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`button button--${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};