import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { checkAdminAuth } from "@/lib/auth";
import Dashboard from "@/components/admin/Dashboard";

export default function AdminDashboardPage() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if authenticated
    const checkAuth = async () => {
      const isAuthenticated = await checkAdminAuth();
      if (!isAuthenticated) {
        navigate("/admin/login");
        return;
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-300 h-16 w-16 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-24 mb-2.5"></div>
          <div className="h-3 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-[#000080] text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold font-poppins">
          Sanskruti <span className="text-[#FF9933]">Travels</span> - Admin
        </h1>
        <a href="/" className="text-sm hover:underline" target="_blank" rel="noopener noreferrer">
          View Website
        </a>
      </div>
      
      <Dashboard />
    </div>
  );
}
