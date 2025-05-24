import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Package } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

interface InternationalPackageCardProps {
  packageData: Package;
}

const InternationalPackageCard: React.FC<InternationalPackageCardProps> = ({ packageData }) => {
  const { id, title, imageUrl, destinations, duration, price } = packageData;

  return (
    <div className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
      <div className="h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={`${title} Package`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-[#000080] font-poppins mb-2">
          {title}
        </h3>
        <div className="flex items-center mb-3 text-sm text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-[#FF9933] mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{destinations}</span>
        </div>
        <div className="flex items-center mb-4">
          <div className="mr-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-[#FF9933] mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-600">{duration}</span>
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-[#FF9933] mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-semibold">
              {formatCurrency(price)} per person
            </span>
          </div>
        </div>
        <Link
          href={`/package-details/${id}`}
          className="block text-center bg-[#000080] text-white px-4 py-2 rounded hover:bg-[#FF9933] transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default function InternationalPackages() {
  const { data: packages, isLoading, error } = useQuery<Package[]>({
    queryKey: ["/api/packages/international"],
  });

  return (
    <section className="py-16 bg-white" id="international">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#000080] font-poppins mb-2">
              International Destinations
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Explore exotic international locations with our carefully crafted
              packages.
            </p>
          </div>
          <Link
            href="/package-list?type=international"
            className="mt-4 md:mt-0 text-[#000080] font-medium hover:text-[#FF9933] transition flex items-center"
          >
            View All International Packages
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-lg h-[330px] animate-pulse"
              >
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg text-red-500">
            Failed to load international packages. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages?.slice(0, 3).map((packageItem) => (
              <InternationalPackageCard
                key={packageItem.id}
                packageData={packageItem}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
