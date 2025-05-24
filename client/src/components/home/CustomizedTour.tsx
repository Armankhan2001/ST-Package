import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { insertCustomTourRequestSchema } from "@shared/schema";
import { generateCustomTourMessage, getWhatsAppUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Extend the schema with validation rules
const customTourSchema = insertCustomTourRequestSchema.extend({
  name: z.string().min(3, "Name is required (min 3 characters)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  destination: z.string().min(2, "Destination is required"),
  travelDates: z.string().min(3, "Please provide approximate travel dates"),
  numberOfTravelers: z.number().min(1, "At least 1 traveler is required"),
});

type CustomTourFormValues = z.infer<typeof customTourSchema>;

export default function CustomizedTour() {
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CustomTourFormValues>({
    resolver: zodResolver(customTourSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      destination: "",
      travelDates: "",
      numberOfTravelers: 1,
      specialRequirements: "",
      whatsappConsent: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CustomTourFormValues) => {
      return apiRequest("POST", "/api/custom-tour", data);
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted!",
        description: "We will get back to you soon with a custom itinerary.",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CustomTourFormValues) => {
    mutation.mutate(data);
  };

  // Watch form values to generate WhatsApp message
  const watchedValues = {
    name: watch("name"),
    phone: watch("phone"),
    destination: watch("destination"),
    dates: watch("travelDates"),
    travelers: watch("numberOfTravelers"),
    requirements: watch("specialRequirements"),
  };

  const whatsappMessage = generateCustomTourMessage(watchedValues);

  return (
    <section className="py-16 bg-[#F5F5F5]" id="customize">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto">
              <img
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
                alt="Customized Travel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#FF9933] bg-opacity-30 flex items-center justify-center">
                <div className="text-white text-center px-6">
                  <h3 className="text-2xl font-bold mb-2 font-poppins">
                    Create Your Dream Trip
                  </h3>
                  <p className="text-lg">Tailor-made experiences just for you</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-[#000080] font-poppins">
                Customize Your Travel Experience
              </h2>
              <p className="text-gray-600 mb-6">
                Tell us your travel preferences and let our experts design the
                perfect itinerary for you.
              </p>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      className={`w-full p-3 border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
                      placeholder="Your Name"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                      </p>
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
                      placeholder="your@email.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      className={`w-full p-3 border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
                      placeholder="Your Phone Number"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Destination*
                    </label>
                    <input
                      type="text"
                      className={`w-full p-3 border ${
                        errors.destination ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
                      placeholder="Where would you like to go?"
                      {...register("destination")}
                    />
                    {errors.destination && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.destination.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Travel Dates*
                    </label>
                    <input
                      type="text"
                      className={`w-full p-3 border ${
                        errors.travelDates ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
                      placeholder="Approximate travel dates"
                      {...register("travelDates")}
                    />
                    {errors.travelDates && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.travelDates.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Travelers*
                    </label>
                    <input
                      type="number"
                      min="1"
                      className={`w-full p-3 border ${
                        errors.numberOfTravelers
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
                      {...register("numberOfTravelers", { valueAsNumber: true })}
                    />
                    {errors.numberOfTravelers && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.numberOfTravelers.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirements
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700"
                    placeholder="Tell us about your preferences and requirements"
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
                  <label
                    htmlFor="whatsapp-consent"
                    className="text-sm text-gray-700"
                  >
                    I consent to be contacted via WhatsApp at the number provided
                  </label>
                </div>

                <div className="flex justify-between items-center">
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
                    <span>Contact on WhatsApp</span>
                  </a>
                  <button
                    type="submit"
                    className="bg-[#FF9933] text-white px-6 py-3 rounded-md font-medium hover:bg-[#000080] transition"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
