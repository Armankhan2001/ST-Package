import React, { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { checkAdminAuth } from "@/lib/auth";
import PackageForm from "@/components/admin/PackageForm";
import { Package } from "@shared/schema";

export default function AdminEditPage() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/admin/edit/:id");
  const packageId = params?.id ? parseInt(params.id, 10) : 0;
  const [loading, setLoading] = useState(true);

  const { data: packageData, isLoading: packageLoading, error } = useQuery<Package>({
    queryKey: [`/api/packages/${packageId}`],
    enabled: !loading && packageId > 0,
  });

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

  if (loading || packageLoading) {
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

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="bg-[#000080] text-white py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold font-poppins">
            Sanskruti <span className="text-[#FF9933]">Travels</span> - Admin
          </h1>
          <a href="/admin/dashboard" className="text-sm hover:underline">
            Back to Dashboard
          </a>
        </div>
        
        <div className="container mx-auto py-8 px-4">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Package Not Found</h2>
            <p className="text-gray-600 mb-6">The package you are trying to edit does not exist or could not be loaded.</p>
            <a
              href="/admin/dashboard"
              className="inline-block bg-[#000080] text-white px-6 py-3 rounded-md font-medium hover:bg-[#FF9933] transition"
            >
              Return to Dashboard
            </a>
          </div>
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
        <a href="/admin/dashboard" className="text-sm hover:underline">
          Back to Dashboard
        </a>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        <PackageForm packageData={packageData} isEditing={true} />
      </div>
    </div>
  );
}
