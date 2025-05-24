import React, { useState } from "react";
import { Link, useLocation } from "wouter";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "National", href: "/#national" },
  { label: "International", href: "/#international" },
  { label: "Custom Packages", href: "/#customize" },
  { label: "About Us", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Handle hash links click
  const handleHashLinkClick = (href: string) => {
    if (href.startsWith("/#")) {
      // If we're already on the home page and clicking a hash link
      if (location === "/") {
        const elementId = href.substring(2);
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          closeMobileMenu();
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-[#000080] font-poppins">
            Sanskruti <span className="text-[#FF9933]">Travels</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => handleHashLinkClick(link.href)}
              className="font-medium text-[#000080] hover:text-[#FF9933] transition"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/package-list"
            className="bg-[#FF9933] text-white px-4 py-2 rounded-md hover:bg-[#000080] transition"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Navigation Button */}
        <button
          className="md:hidden text-[#000080] focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full left-0 z-50">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  handleHashLinkClick(link.href);
                  closeMobileMenu();
                }}
                className="font-medium text-[#000080] hover:text-[#FF9933] transition p-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book-package"
              onClick={closeMobileMenu}
              className="bg-[#FF9933] text-white px-4 py-2 rounded-md hover:bg-[#000080] transition text-center"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
