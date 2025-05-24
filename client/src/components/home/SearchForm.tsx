import React, { useState } from "react";
import { useLocation } from "wouter";

export default function SearchForm() {
  const [location, navigate] = useLocation();
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (destination && destination !== "Any Destination") {
      params.append("destination", destination);
    }
    if (travelDate) {
      params.append("date", travelDate);
    }
    if (budget && budget !== "Any Budget") {
      params.append("budget", budget);
    }
    
    // Navigate to packages page with search parameters
    navigate(`/package-list?${params.toString()}`);
  };

  return (
    <section className="bg-white py-6 shadow-lg relative -mt-10 rounded-lg max-w-5xl mx-auto z-20 px-4">
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <div className="relative">
            <select
              className="block w-full rounded-md border-gray-300 border p-3 pr-10 focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option>Any Destination</option>
              <option value="national">India</option>
              <option value="international">International</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Travel Date
          </label>
          <div className="relative">
            <input
              type="date"
              className="block w-full rounded-md border-gray-300 border p-3 focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget Range
          </label>
          <div className="relative">
            <select
              className="block w-full rounded-md border-gray-300 border p-3 pr-10 focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            >
              <option>Any Budget</option>
              <option>₹10,000 - ₹25,000</option>
              <option>₹25,000 - ₹50,000</option>
              <option>₹50,000 - ₹100,000</option>
              <option>₹100,000+</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="md:col-span-3">
          <button
            type="submit"
            className="w-full bg-[#000080] text-white py-3 rounded-md font-medium hover:bg-[#FF9933] transition"
          >
            Search Packages
          </button>
        </div>
      </form>
    </section>
  );
}
