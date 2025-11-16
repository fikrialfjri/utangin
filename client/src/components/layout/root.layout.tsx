import { type ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

const RootLayout = ({ children }: IProps) => {
  return <main className="app-container">{children}</main>;
};

export default RootLayout;
