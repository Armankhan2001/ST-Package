import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import PackageList from "@/components/package/PackageList";

export default function PackageListPage() {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState<URLSearchParams | undefined>();
  const [packageType, setPackageType] = useState<"all" | "national" | "international">("all");

  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    setSearchParams(params);
    
    // Determine package type from URL params
    const typeParam = params.get("type");
    if (typeParam === "national" || typeParam === "international") {
      setPackageType(typeParam);
    } else {
      setPackageType("all");
    }
  }, [location]);

  return (
    <>
      <Header />
      <main className="bg-[#F5F5F5] pt-8 pb-16">
        <div className="container mx-auto px-4">
          <PackageList type={packageType} searchParams={searchParams} />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
