import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { insertPackageSchema, Package } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Extend the schema with validation rules
const packageFormSchema = insertPackageSchema.extend({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(1, "Price must be greater than 0"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  duration: z.string().min(3, "Duration must be at least 3 characters (e.g. '7 Days / 6 Nights')"),
  destinations: z.string().min(3, "Destinations must be at least 3 characters"),
  imageUrl: z.string().url("Please enter a valid image URL"),
  type: z.enum(["national", "international"], {
    errorMap: () => ({ message: "Type must be either 'national' or 'international'" }),
  }),
  featured: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
});

type PackageFormValues = z.infer<typeof packageFormSchema>;

interface PackageFormProps {
  packageData?: Package;
  isEditing?: boolean;
}

export default function PackageForm({ packageData, isEditing = false }: PackageFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [previewImage, setPreviewImage] = useState<string>(packageData?.imageUrl || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: packageData || {
      title: "",
      description: "",
      price: 0,
      location: "",
      duration: "",
      destinations: "",
      imageUrl: "",
      type: "national",
      featured: false,
      bestSeller: false,
      rating: 0,
      reviewCount: 0,
    },
  });

  // Watch the imageUrl to update the preview
  const watchedImageUrl = watch("imageUrl");
  React.useEffect(() => {
    if (watchedImageUrl && watchedImageUrl !== previewImage) {
      setPreviewImage(watchedImageUrl);
    }
  }, [watchedImageUrl, previewImage]);

  const createMutation = useMutation({
    mutationFn: (data: PackageFormValues) => {
      return apiRequest("POST", "/api/packages", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Package created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      navigate("/admin/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create package. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: PackageFormValues) => {
      return apiRequest("PATCH", `/api/packages/${packageData?.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Package updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      navigate("/admin/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update package. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PackageFormValues) => {
    if (isEditing && packageData) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#000080] mb-6 font-poppins">
        {isEditing ? "Edit Package" : "Create New Package"}
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Title*
            </label>
            <input
              type="text"
              className={`w-full p-3 border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
              placeholder="Enter package title"
              {...register("title")}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (INR)*
            </label>
            <input
              type="number"
              className={`w-full p-3 border ${
                errors.price ? "border-red-500" : "border-gray-300"
              } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
              placeholder="Enter price in INR"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location*
            </label>
            <input
              type="text"
              className={`w-full p-3 border ${
                errors.location ? "border-red-500" : "border-gray-300"
              } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
              placeholder="Enter location"
              {...register("location")}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration*
            </label>
            <input
              type="text"
              className={`w-full p-3 border ${
                errors.duration ? "border-red-500" : "border-gray-300"
              } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
              placeholder="E.g., 7 Days / 6 Nights"
              {...register("duration")}
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-500">{errors.duration.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destinations Covered*
          </label>
          <input
            type="text"
            className={`w-full p-3 border ${
              errors.destinations ? "border-red-500" : "border-gray-300"
            } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
            placeholder="E.g., Delhi, Agra, Jaipur"
            {...register("destinations")}
          />
          {errors.destinations && (
            <p className="mt-1 text-sm text-red-500">{errors.destinations.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            rows={6}
            className={`w-full p-3 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
            placeholder="Enter detailed package description"
            {...register("description")}
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL*
            </label>
            <input
              type="text"
              className={`w-full p-3 border ${
                errors.imageUrl ? "border-red-500" : "border-gray-300"
              } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
              placeholder="Enter image URL"
              {...register("imageUrl")}
            />
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.imageUrl.message}</p>
            )}
            {previewImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                <img 
                  src={previewImage} 
                  alt="Package Preview" 
                  className="h-40 w-full object-cover rounded-md"
                  onError={() => setPreviewImage("")}
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Type*
            </label>
            <select
              className={`w-full p-3 border ${
                errors.type ? "border-red-500" : "border-gray-300"
              } rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700`}
              {...register("type")}
            >
              <option value="national">National</option>
              <option value="international">International</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
            )}
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  className="mr-2"
                  {...register("featured")}
                />
                <label htmlFor="featured" className="text-sm text-gray-700">
                  Featured Package
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="bestSeller"
                  className="mr-2"
                  {...register("bestSeller")}
                />
                <label htmlFor="bestSeller" className="text-sm text-gray-700">
                  Best Seller
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating (0-5)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              className="w-full p-3 border border-gray-300 rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700"
              {...register("rating", { valueAsNumber: true })}
            />
            {errors.rating && (
              <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review Count
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-md focus:border-[#FF9933] focus:ring-[#FF9933] text-gray-700"
              {...register("reviewCount", { valueAsNumber: true })}
            />
            {errors.reviewCount && (
              <p className="mt-1 text-sm text-red-500">{errors.reviewCount.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            onClick={() => navigate("/admin/dashboard")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#FF9933] text-white rounded-md hover:bg-[#000080] transition"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : isEditing
              ? "Update Package"
              : "Create Package"}
          </button>
        </div>
      </form>
    </div>
  );
}
