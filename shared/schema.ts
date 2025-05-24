import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin users for package management
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true,
});

// Base package schema
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in INR
  location: text("location").notNull(),
  duration: text("duration").notNull(), // e.g. "7 Days / 6 Nights"
  destinations: text("destinations").notNull(), // e.g. "Delhi, Agra, Jaipur"
  imageUrl: text("image_url").notNull(),
  type: text("type").notNull(), // "national" or "international"
  featured: boolean("featured").default(false),
  bestSeller: boolean("best_seller").default(false),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Booking schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  travelDate: text("travel_date").notNull(),
  numberOfTravelers: integer("number_of_travelers").notNull(),
  specialRequirements: text("special_requirements"),
  whatsappConsent: boolean("whatsapp_consent").default(false),
  status: text("status").default("pending"), // pending, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

// Custom tour request schema
export const customTourRequests = pgTable("custom_tour_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  destination: text("destination").notNull(),
  travelDates: text("travel_dates").notNull(),
  numberOfTravelers: integer("number_of_travelers").notNull(),
  specialRequirements: text("special_requirements"),
  whatsappConsent: boolean("whatsapp_consent").default(false),
  status: text("status").default("pending"), // pending, processing, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCustomTourRequestSchema = createInsertSchema(customTourRequests).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  whatsappConsent: boolean("whatsapp_consent").default(false),
  status: text("status").default("unread"), // unread, read, replied
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Types
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;

export type Package = typeof packages.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type CustomTourRequest = typeof customTourRequests.$inferSelect;
export type InsertCustomTourRequest = z.infer<typeof insertCustomTourRequestSchema>;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
