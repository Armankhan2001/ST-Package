import React from "react";
import { Link } from "wouter";
import { getWhatsAppUrl, WHATSAPP_NUMBER } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-[#000080] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 font-poppins">Sanskruti Travels</h3>
            <p className="text-gray-300 mb-4">
              Your trusted travel partner for national and international journeys. We specialize in creating memorable travel experiences tailored to your preferences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[#FF9933] transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-[#FF9933] transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-[#FF9933] transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-[#FF9933] transition">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 font-poppins">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#FF9933] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-300 hover:text-[#FF9933] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#national" className="text-gray-300 hover:text-[#FF9933] transition">
                  National Packages
                </Link>
              </li>
              <li>
                <Link href="/#international" className="text-gray-300 hover:text-[#FF9933] transition">
                  International Packages
                </Link>
              </li>
              <li>
                <Link href="/#customize" className="text-gray-300 hover:text-[#FF9933] transition">
                  Customize Package
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-300 hover:text-[#FF9933] transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 font-poppins">Top Destinations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/package-list?type=national" className="text-gray-300 hover:text-[#FF9933] transition">
                  Rajasthan
                </Link>
              </li>
              <li>
                <Link href="/package-list?type=national" className="text-gray-300 hover:text-[#FF9933] transition">
                  Kerala
                </Link>
              </li>
              <li>
                <Link href="/package-list?type=national" className="text-gray-300 hover:text-[#FF9933] transition">
                  Goa
                </Link>
              </li>
              <li>
                <Link href="/package-list?type=international" className="text-gray-300 hover:text-[#FF9933] transition">
                  Dubai
                </Link>
              </li>
              <li>
                <Link href="/package-list?type=international" className="text-gray-300 hover:text-[#FF9933] transition">
                  Singapore
                </Link>
              </li>
              <li>
                <Link href="/package-list?type=international" className="text-gray-300 hover:text-[#FF9933] transition">
                  Thailand
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 font-poppins">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 mr-3 text-[#FF9933]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-300">123 Travel Plaza, MG Road, Mumbai, Maharashtra - 400001, India</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#FF9933]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-300">+{WHATSAPP_NUMBER}</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#FF9933]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300">info@sanskrutitravels.com</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#FF9933]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <a href={getWhatsAppUrl()} className="text-gray-300 hover:text-[#FF9933] transition">
                  +{WHATSAPP_NUMBER}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left">© 2023 Sanskruti Travels. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#FF9933] transition text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#FF9933] transition text-sm">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#FF9933] transition text-sm">
                    Cancellation Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
