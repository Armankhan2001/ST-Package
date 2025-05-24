import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import HeroSection from "@/components/home/HeroSection";
import SearchForm from "@/components/home/SearchForm";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import NationalPackages from "@/components/home/NationalPackages";
import InternationalPackages from "@/components/home/InternationalPackages";
import LuxuryExperience from "@/components/home/LuxuryExperience";
import CustomizedTour from "@/components/home/CustomizedTour";
import Testimonials from "@/components/home/Testimonials";
import AboutUs from "@/components/home/AboutUs";
import CTASection from "@/components/home/CTASection";
import ContactForm from "@/components/home/ContactForm";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <SearchForm />
        <FeaturedPackages />
        <WhyChooseUs />
        <NationalPackages />
        <InternationalPackages />
        <LuxuryExperience />
        <CustomizedTour />
        <Testimonials />
        <AboutUs />
        <CTASection />
        <ContactForm />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
