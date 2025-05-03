import React, { useEffect, useRef, ReactNode } from "react";
import Sidebar from "../Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref}>
      <Sidebar />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
