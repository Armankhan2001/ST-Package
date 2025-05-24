import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export const WHATSAPP_NUMBER = "917977527874";

export function getWhatsAppUrl(message: string = ""): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getStarRating(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    full: Array(fullStars).fill(null),
    half: hasHalfStar ? [null] : [],
    empty: Array(emptyStars).fill(null)
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateBookingMessage(booking: {
  packageName: string;
  name: string;
  phone: string;
  travelDate: string;
  travelers: number;
}): string {
  return `Hello, I would like to book the "${booking.packageName}" package. My details: Name: ${booking.name}, Phone: ${booking.phone}, Travel Date: ${booking.travelDate}, Number of Travelers: ${booking.travelers}`;
}

export function generateCustomTourMessage(request: {
  name: string;
  phone: string;
  destination: string;
  dates: string;
  travelers: number;
  requirements?: string;
}): string {
  let message = `Hello, I would like to request a custom tour. My details: Name: ${request.name}, Phone: ${request.phone}, Destination: ${request.destination}, Dates: ${request.dates}, Travelers: ${request.travelers}`;
  
  if (request.requirements) {
    message += `, Special Requirements: ${request.requirements}`;
  }
  
  return message;
}
