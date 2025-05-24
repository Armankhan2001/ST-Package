import React from "react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section
      className="relative h-[70vh] bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
      }}
    >
      <div className="absolute inset-0 bg-[#000080] bg-opacity-50"></div>
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-poppins">
            Discover the Beauty of India and Beyond
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Experience incredible journeys with Sanskruti Travels - your trusted
            companion for national and international adventures.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/#packages"
              className="bg-[#FF9933] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-white hover:text-[#FF9933] transition text-center"
            >
              Explore Packages
            </Link>
            <Link
              href="/#customize"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-white hover:text-[#000080] transition text-center"
            >
              Customize Trip
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
