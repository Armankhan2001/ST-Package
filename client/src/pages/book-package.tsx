import React from "react";
import { useRoute } from "wouter";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import Booking from "@/components/package/Booking";

export default function BookPackagePage() {
  const [, params] = useRoute("/book-package/:id");
  const packageId = params?.id ? parseInt(params.id, 10) : 0;

  return (
    <>
      <Header />
      <main className="bg-[#F5F5F5] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#000080] text-center mb-8 font-poppins">
            Book Your Travel Package
          </h1>
          <div className="max-w-4xl mx-auto">
            <Booking packageId={packageId} />
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
