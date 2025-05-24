import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { Package } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { logoutAdmin } from "@/lib/auth";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: packages = [], isLoading, error } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/packages/${id}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Package deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete package. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = async () => {
    try {
      const result = await logoutAdmin();
      if (result.success) {
        toast({
          title: "Logged Out",
          description: "You have been logged out successfully.",
        });
        navigate("/admin/login");
      } else {
        toast({
          title: "Error",
          description: "Failed to log out. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      deleteMutation.mutate(id);
    }
  };

  // Filter packages based on type and search query
  const filteredPackages = packages.filter((pkg) => {
    const matchesType = filterType === "all" || pkg.type === filterType;
    const matchesSearch = 
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destinations.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#000080] mb-2 font-poppins">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your travel packages and view booking information
          </p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2 flex">
          <Link
            href="/admin/bookings"
            className="inline-block bg-[#000080] text-white px-4 py-2 rounded-md font-medium hover:bg-[#000060] transition mr-2"
          >
            Manage Bookings
          </Link>
          <Link
            href="/admin/create"
            className="inline-block bg-[#FF9933] text-white px-4 py-2 rounded-md font-medium hover:bg-[#E88822] transition"
          >
            Add New Package
          </Link>
          <button
            onClick={handleLogout}
            className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition ml-2"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search packages..."
              className="w-full p-2 border border-gray-300 rounded-md focus:border-[#FF9933] focus:ring-[#FF9933]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 rounded-md ${
                filterType === "all"
                  ? "bg-[#000080] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setFilterType("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded-md ${
                filterType === "national"
                  ? "bg-[#000080] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setFilterType("national")}
            >
              National
            </button>
            <button
              className={`px-3 py-1 rounded-md ${
                filterType === "international"
                  ? "bg-[#000080] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setFilterType("international")}
            >
              International
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg text-red-500">
            Failed to load packages. Please refresh the page.
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Packages Found</h3>
            <p className="text-gray-500">
              No packages match your current filters. Try adjusting your search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-md object-cover" src={pkg.imageUrl} alt={pkg.title} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {pkg.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {pkg.destinations}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pkg.type === "national" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {pkg.type.charAt(0).toUpperCase() + pkg.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(pkg.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pkg.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {pkg.featured && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                        {pkg.bestSeller && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Best Seller
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/package-details/${pkg.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          target="_blank"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/edit/${pkg.id}`}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(pkg.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
