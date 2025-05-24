import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { insertBookingSchema } from "@shared/schema";
import { Package } from "@shared/schema";
import { formatCurrency, generateBookingMessage, getWhatsAppUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Extend the schema with validation rules
const bookingFormSchema = insertBookingSchema.extend({
  name: z.string().min(3, "Name is required (min 3 characters)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  travelDate: z.string().min(3, "Please select or enter travel date"),
  numberOfTravelers: z.number().min(1, "At least 1 traveler is required").max(20, "Maximum 20 travelers allowed"),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingProps {
  packageId: number;
}

export default function Booking({ packageId }: BookingProps) {
  const { toast } = useToast();
  
  const { data: packageData, isLoading: packageLoading } = useQuery<Package>({
    queryKey: [`/api/packages/${packageId}`],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      packageId,
      name: "",
      email: "",
      phone: "",
      travelDate: "",
      numberOfTravelers: 1,
      specialRequirements: "",
      whatsappConsent: false,
      status: "pending",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: BookingFormValues) => {
      return apiRequest("POST", "/api/bookings", data);
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Successful!",
        description: "We'll contact you shortly to confirm your booking details.",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit your booking. Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    mutation.mutate(data);
  };

  // Watch form values to generate WhatsApp message
  const name = watch("name");
  const phone = watch("phone");
  const travelDate = watch("travelDate");
  const numberOfTravelers = watch("numberOfTravelers");

  const whatsappMessage = packageData
    ? generateBookingMessage({
        packageName: packageData.title,
        name,
        phone,
        travelDate,
        travelers: numberOfTravelers,
      })
    : "";

  if (packageLoading) {
    return (
      <div className="animate-pulse p-8 bg-white rounded-lg shadow-lg">
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-12 bg-gray-300 rounded"></div>
          <div className="h-12 bg-gray-300 rounded"></div>
          <div className="h-12 bg-gray-300 rounded"></div>
          <div className="h-12 bg-gray-300 rounded"></div>
        </div>
        <div className="h-24 bg-gray-300 rounded mt-4"></div>
        <div className="h-12 bg-gray-300 rounded mt-6"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Package Not Found</h2>
        <p className="text-gray-700">
          We couldn't find the package you're trying to book. Please go back and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#000080] mb-2 font-poppins">
          Book Your Package
        </h2>
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h3 className="text-xl font-semibold mb-1">{packageData.title}</h3>
            <p className="text-gray-600 mb-2">{packageData.duration}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[#FF9933]">{formatCurrency(packageData.price)}</p>
            <p className="text-sm text-gray-500">per person</p>
          </div>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name*
            </label>
            <input
              type="text"
              className={`w-full p-3 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
              placeholder="Enter your full name"
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address*
            </label>
            <input
              type="email"
              className={`w-full p-3 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number*
            </label>
            <input
              type="tel"
              className={`w-full p-3 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
              placeholder="Enter your phone number"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Travel Date*
            </label>
            <input
              type="date"
              className={`w-full p-3 border ${
                errors.travelDate ? "border-red-500" : "border-gray-300"
              } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
              {...register("travelDate")}
            />
            {errors.travelDate && (
              <p className="mt-1 text-sm text-red-500">{errors.travelDate.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Travelers*
            </label>
            <input
              type="number"
              min="1"
              className={`w-full p-3 border ${
                errors.numberOfTravelers ? "border-red-500" : "border-gray-300"
              } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
              {...register("numberOfTravelers", { valueAsNumber: true })}
            />
            {errors.numberOfTravelers && (
              <p className="mt-1 text-sm text-red-500">
                {errors.numberOfTravelers.message}
              </p>
            )}
          </div>
          <div className="md:flex items-end pb-3 hidden">
            <p className="text-lg font-semibold">
              Total: {formatCurrency(packageData.price * numberOfTravelers)}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requirements or Requests
          </label>
          <textarea
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700"
            placeholder="Any special requirements or requests for your trip"
            {...register("specialRequirements")}
          ></textarea>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="whatsapp-consent"
            className="mr-2"
            {...register("whatsappConsent")}
          />
          <label htmlFor="whatsapp-consent" className="text-sm text-gray-700">
            I consent to be contacted via WhatsApp at the number provided
          </label>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <a
            href={getWhatsAppUrl(whatsappMessage)}
            className="flex items-center text-[#000080] hover:text-[#FF9933] transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="h-5 w-5 mr-2 fill-current"
            >
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
            <span>Book via WhatsApp</span>
          </a>
          <button
            type="submit"
            className="bg-[#FF9933] text-white px-8 py-3 rounded-md font-medium hover:bg-[#000080] transition"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-[#000080] mb-2">
          Booking Terms & Conditions
        </h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>A 25% advance payment is required to confirm your booking.</li>
          <li>Full payment must be received 30 days prior to departure.</li>
          <li>Cancellation up to 30 days before departure: Full refund less 10% administrative fee.</li>
          <li>Cancellation between 15-29 days: 50% refund.</li>
          <li>Cancellation less than 15 days: No refund.</li>
          <li>We reserve the right to alter the itinerary due to unforeseen circumstances.</li>
        </ul>
      </div>
    </div>
  );
}
