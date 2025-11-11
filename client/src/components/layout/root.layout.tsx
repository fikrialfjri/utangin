import React from 'react';

interface IProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: IProps) => {
  return <main className="app-container">{children}</main>;
};

export default RootLayout;
