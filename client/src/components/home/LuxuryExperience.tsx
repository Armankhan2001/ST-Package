import React from "react";
import { Link } from "wouter";

interface LuxuryCardProps {
  title: string;
  description: string;
  image: string;
  linkText: string;
  linkUrl: string;
}

const LuxuryCard: React.FC<LuxuryCardProps> = ({
  title,
  description,
  image,
  linkText,
  linkUrl,
}) => (
  <div className="relative rounded-lg overflow-hidden group h-96">
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
    />
    <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition duration-300"></div>
    <div className="absolute inset-0 flex flex-col justify-end p-8">
      <h3 className="text-2xl font-bold mb-2 font-poppins text-white">{title}</h3>
      <p className="text-gray-200 mb-4">{description}</p>
      <Link
        href={linkUrl}
        className="inline-block bg-[#FF9933] text-white px-4 py-2 rounded-md font-medium hover:bg-white hover:text-[#000080] transition w-max"
      >
        {linkText}
      </Link>
    </div>
  </div>
);

export default function LuxuryExperience() {
  return (
    <section className="py-16 bg-[#000080] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-poppins">
            Luxury Travel Experiences
          </h2>
          <p className="text-gray-300">
            Indulge in our premium travel packages designed for the discerning
            traveler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <LuxuryCard
            title="5-Star Luxury Stays"
            description="Experience world-class hospitality at our handpicked luxury hotels and resorts."
            image="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
            linkText="Explore Luxury Packages"
            linkUrl="/package-list?category=luxury"
          />

          <LuxuryCard
            title="Premium Cruise Journeys"
            description="Sail in luxury with our curated cruise packages to exotic destinations worldwide."
            image="https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
            linkText="Discover Cruise Packages"
            linkUrl="/package-list?category=cruise"
          />
        </div>
      </div>
    </section>
  );
}
