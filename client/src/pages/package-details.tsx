import React from "react";
import { useRoute } from "wouter";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import PackageDetails from "@/components/package/PackageDetails";

export default function PackageDetailsPage() {
  const [, params] = useRoute("/package-details/:id");
  const packageId = params?.id ? parseInt(params.id, 10) : 0;

  return (
    <>
      <Header />
      <main className="pt-8 pb-16 bg-[#F5F5F5]">
        <PackageDetails packageId={packageId} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
