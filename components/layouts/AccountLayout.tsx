import { Navbar, Sidebar } from '@/components/shared';
import React, { useRef } from 'react';
import useCollapse from 'hooks/useCollapse';
import { ElementRef, MouseEventHandler } from 'react';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const sidebarRef = useRef<ElementRef<'aside'>>(null);
  const [collapse, setCollapse] = useCollapse(sidebarRef, 'dashboard-wrapper');

  const toggleSidebar: MouseEventHandler<HTMLButtonElement> = () => {
    setCollapse((prev) => !prev);
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex overflow-hidden pt-16 h-full">
        <Sidebar isCollapsed={collapse} ref={sidebarRef} />
        <div className="relative h-full w-full overflow-y-auto lg:ml-64">
          <main>
            <div className="flex h-screen w-full justify-center">
              <div className="w-3/4 px-6 py-6 ">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
