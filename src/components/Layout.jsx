import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 hidden lg:flex lg:flex-col">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl">
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Header
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;