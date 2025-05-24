import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { checkAdminAuth } from "@/lib/auth";
import Login from "@/components/admin/Login";

export default function AdminLoginPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Check if already authenticated
    const checkAuth = async () => {
      const isAuthenticated = await checkAdminAuth();
      if (isAuthenticated) {
        navigate("/admin/dashboard");
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-[#000080] font-poppins mb-4">
          Sanskruti <span className="text-[#FF9933]">Travels</span>
        </h1>
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Admin Panel
        </h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Login />
      </div>
    </div>
  );
}
