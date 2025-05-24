import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import PackageCard from "@/components/package/PackageCard";
import { Package } from "@shared/schema";

export default function FeaturedPackages() {
  const { data: packages, isLoading, error } = useQuery<Package[]>({
    queryKey: ["/api/packages/featured"],
  });

  return (
    <section className="py-16 bg-[#F5F5F5]" id="packages">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#000080] font-poppins">
            Featured Travel Packages
          </h2>
          <p className="text-gray-600">
            Discover our most popular and handpicked travel experiences across
            India and around the world.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
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
            Failed to load featured packages. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages?.slice(0, 3).map((packageItem) => (
              <PackageCard
                key={packageItem.id}
                packageData={packageItem}
                featured={true}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/package-list"
            className="inline-block bg-[#000080] text-white px-6 py-3 rounded-md font-medium hover:bg-[#FF9933] transition"
          >
            View All Packages
          </Link>
        </div>
      </div>
    </section>
  );
}
