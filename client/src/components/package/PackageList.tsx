import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package } from "@shared/schema";
import PackageCard from "@/components/package/PackageCard";

interface PackageListProps {
  type?: "national" | "international" | "all";
  searchParams?: URLSearchParams;
}

export default function PackageList({ type = "all", searchParams }: PackageListProps) {
  const [sortBy, setSortBy] = useState<string>("featured");
  
  // Construct query key based on filters
  const queryKey = type === "all" ? "/api/packages" : `/api/packages/${type}`;
  
  // If there are search params, add them to the query
  let finalQueryKey = queryKey;
  if (searchParams && searchParams.toString()) {
    finalQueryKey = `${queryKey}?${searchParams.toString()}`;
  }
  
  const { data: packages = [], isLoading, error } = useQuery<Package[]>({
    queryKey: [finalQueryKey],
  });

  // Sort packages
  const sortedPackages = [...packages].sort((a, b) => {
    switch (sortBy) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "featured":
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || 
               (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
    }
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#000080] font-poppins mb-2">
            {type === "national" 
              ? "National Packages" 
              : type === "international" 
              ? "International Packages" 
              : "All Travel Packages"}
          </h2>
          <p className="text-gray-600 max-w-2xl">
            {type === "national"
              ? "Discover the incredible diversity of India with our curated packages."
              : type === "international"
              ? "Explore exotic international locations with our carefully crafted packages."
              : "Browse through our collection of handpicked travel experiences."}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <label className="mr-2 text-gray-700">Sort by:</label>
          <select
            className="border border-gray-300 rounded p-2 focus:border-[#FF9933] focus:ring-[#FF9933]"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-lg h-[480px] animate-pulse"
            >
              <div className="h-64 bg-gray-300"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 rounded-lg text-red-500">
          Failed to load packages. Please try again later.
        </div>
      ) : sortedPackages.length === 0 ? (
        <div className="text-center p-16 bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Packages Found</h3>
          <p className="text-gray-500">
            We couldn't find any packages matching your criteria. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPackages.map((packageItem) => (
            <PackageCard
              key={packageItem.id}
              packageData={packageItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
