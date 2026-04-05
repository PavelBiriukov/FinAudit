import React from 'react';
import './Container.css';

type ContainerProps = {
  children: React.ReactNode;
};

export const Container = ({ children }: ContainerProps) => {
  return <div className="container">{children}</div>;
};