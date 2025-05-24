import React from "react";
import { Link } from "wouter";
import { formatCurrency, getStarRating } from "@/lib/utils";
import { Package } from "@shared/schema";

interface PackageCardProps {
  packageData: Package;
  featured?: boolean;
}

export default function PackageCard({ packageData, featured = false }: PackageCardProps) {
  const { id, title, price, duration, destinations, imageUrl, rating, reviewCount, description, featured: isFeatured, bestSeller } = packageData;
  
  const { full: fullStars, half: halfStars, empty: emptyStars } = getStarRating(rating);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={`${title} Package`}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
        {isFeatured && (
          <div className="absolute top-4 right-4 bg-[#FF9933] text-white text-sm font-bold px-3 py-1 rounded-full">
            Featured
          </div>
        )}
        {bestSeller && (
          <div className="absolute top-4 right-4 bg-[#138808] text-white text-sm font-bold px-3 py-1 rounded-full">
            Best Seller
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-[#000080] font-poppins">{title}</h3>
          <div className="flex items-center">
            <span className="text-lg font-bold text-[#FF9933]">{formatCurrency(price)}</span>
            <span className="text-sm text-gray-500 ml-1">/person</span>
          </div>
        </div>
        <div className="flex items-center mb-4 text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF9933] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{duration}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF9933] ml-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{destinations}</span>
        </div>
        {featured && (
          <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        )}
        <hr className="my-4 border-gray-200" />
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {fullStars.map((_, i) => (
              <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            {halfStars.map((_, i) => (
              <svg key={`half-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a.75.75 0 01.671.415l2.987 6.023 6.682.97a.75.75 0 01.415 1.274l-4.828 4.71 1.14 6.648a.75.75 0 01-1.085.79l-5.982-3.14-5.982 3.14a.75.75 0 01-1.085-.79l1.14-6.648-4.828-4.71a.75.75 0 01.415-1.274l6.682-.97 2.987-6.023A.75.75 0 0110 2zm0 3.34L7.865 9.1a.75.75 0 01-.564.41l-4.67.68 3.379 3.3a.75.75 0 01.216.664l-.798 4.655 4.182-2.197a.75.75 0 01.698 0l4.182 2.197-.798-4.655a.75.75 0 01.216-.664l3.379-3.3-4.67-.68a.75.75 0 01-.564-.41L10 5.34z" clipRule="evenodd" />
              </svg>
            ))}
            {emptyStars.map((_, i) => (
              <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
          <Link
            href={`/package-details/${id}`}
            className="text-[#000080] font-medium hover:text-[#FF9933] transition flex items-center"
          >
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
