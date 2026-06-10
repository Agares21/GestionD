import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-900">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex min-h-[calc(100vh-4rem)] overflow-hidden bg-[linear-gradient(90deg,#e2e8f0_0%,#f8fafc_10%,#f8fafc_90%,#dbeafe_100%)]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto">
          <div className="w-full px-4 py-5 sm:px-6 lg:px-8 2xl:px-10">
            <div className="mx-auto w-full max-w-[1680px]">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
