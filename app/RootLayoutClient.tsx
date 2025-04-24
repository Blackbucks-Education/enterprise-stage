"use client"; // Enable client-side features

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SideBarMobileNew from "../components/sidebarmobile";
import Sidebar from "../components/Sidebar";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Import the web version sidebar

export default function RootLayoutClient({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [queryClient] = useState(() => new QueryClient())
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Effect to handle screen size changes
  useEffect(() => {
    // Set initial value based on window width
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth < 768; // Adjust this breakpoint as needed
      setIsMobile(isCurrentlyMobile);

      // Close the sidebar if switching from mobile to desktop
      if (!isCurrentlyMobile) {
        setIsSidebarOpen(false);
      }
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (

    <QueryClientProvider client={queryClient}>
    <div className="h-full bg-[#D7D6D6] relative">
      {/* Navbar */}
      <div className="h-[100px] md:pl-[4.75rem] fixed top-0 w-full z-20"> {/* Lower z-index */}
        <Navbar />
      </div>

      {/* Hamburger Menu Button for Mobile */}
      {!isSidebarOpen && isMobile && (
        <button
          className="hamburger-menu fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <div className="space-y-2">
            <div className="w-8 h-0.5 bg-black"></div>
            <div className="w-8 h-0.5 bg-black"></div>
            <div className="w-8 h-0.5 bg-black"></div>
          </div>
        </button>
      )}

      {/* Sidebar for Desktop */}
      <div className="hidden md:flex h-full w-24 flex-col fixed inset-y-0 z-40">
        <Sidebar />
      </div>

      {/* Sidebar for Mobile */}
      <SideBarMobileNew isOpen={isSidebarOpen} onClose={toggleSidebar} />

      {/* Overlay to fade the backside page */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Page Content */}
      <main
        className={`md:pl-[4.75rem] pt-[50px] h-full ${
          isSidebarOpen ? "overflow-hidden" : ""
        }`}
      >
        {children}
      </main>
    </div>

    </QueryClientProvider>
  );
}