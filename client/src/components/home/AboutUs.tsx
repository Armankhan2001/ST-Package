import React from "react";
import { Link } from "wouter";

export default function AboutUs() {
  return (
    <section id="about" className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#000080] font-poppins">
              About Sanskruti Travels
            </h2>
            <p className="text-gray-600 mb-4">
              Sanskruti Travels is a premier travel agency based in India,
              specializing in curated travel experiences for both national and
              international destinations. With over 10 years of experience in the
              travel industry, we take pride in creating memorable journeys
              tailored to each traveler's preferences.
            </p>
            <p className="text-gray-600 mb-4">
              Our team of travel experts is passionate about exploring new
              destinations and creating unique itineraries that showcase the best
              of local culture, cuisine, and attractions. We believe that travel
              is not just about seeing new places but about creating
              unforgettable memories and experiences.
            </p>
            <p className="text-gray-600 mb-6">
              At Sanskruti Travels, we are committed to providing exceptional
              service, attention to detail, and value for money. Whether you're
              planning a family vacation, a romantic getaway, or an adventure
              trip with friends, we have the expertise to make it perfect.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/#contact"
                className="bg-[#000080] text-white px-6 py-3 rounded-md font-medium hover:bg-[#FF9933] transition"
              >
                Contact Us
              </Link>
              <Link
                href="/package-list"
                className="bg-transparent border border-[#000080] text-[#000080] px-6 py-3 rounded-md font-medium hover:bg-[#000080] hover:text-white transition"
              >
                Our Services
              </Link>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Sanskruti Travels Team"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
