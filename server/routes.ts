import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertPackageSchema, 
  insertBookingSchema, 
  insertCustomTourRequestSchema, 
  insertContactSubmissionSchema, 
  insertAdminSchema 
} from "@shared/schema";
import { auth } from "./auth";
import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { sendBookingNotificationEmail, sendBookingStatusEmail } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session handling
  const SessionStore = MemoryStore(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || 'sanskruti-travels-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 86400000 }, // 24 hours
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  }));

  // Helper to ensure user is authenticated
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.session.isAuthenticated) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Admin auth routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await storage.getAdminByUsername(username);
      
      if (admin && auth.verifyPassword(password, admin.password)) {
        req.session.isAuthenticated = true;
        req.session.adminId = admin.id;
        return res.status(200).json({ success: true });
      }
      
      return res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
      return res.status(500).json({ message: "Server error during login" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ success: true });
    });
  });

  app.get("/api/admin/check-auth", (req, res) => {
    if (req.session.isAuthenticated) {
      return res.status(200).json({ authenticated: true });
    }
    return res.status(401).json({ authenticated: false });
  });

  // Package routes
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getAllPackages();
      return res.status(200).json(packages);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  app.get("/api/packages/featured", async (req, res) => {
    try {
      const packages = await storage.getFeaturedPackages();
      return res.status(200).json(packages);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch featured packages" });
    }
  });

  app.get("/api/packages/national", async (req, res) => {
    try {
      const packages = await storage.getPackagesByType("national");
      return res.status(200).json(packages);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch national packages" });
    }
  });

  app.get("/api/packages/international", async (req, res) => {
    try {
      const packages = await storage.getPackagesByType("international");
      return res.status(200).json(packages);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch international packages" });
    }
  });

  app.get("/api/packages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }
      
      const packageData = await storage.getPackageById(id);
      if (!packageData) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      return res.status(200).json(packageData);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch package" });
    }
  });

  app.post("/api/packages", requireAuth, async (req, res) => {
    try {
      const packageData = insertPackageSchema.parse(req.body);
      const newPackage = await storage.createPackage(packageData);
      return res.status(201).json(newPackage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid package data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create package" });
    }
  });

  app.patch("/api/packages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }
      
      const packageData = insertPackageSchema.parse(req.body);
      const updatedPackage = await storage.updatePackage(id, packageData);
      
      if (!updatedPackage) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      return res.status(200).json(updatedPackage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid package data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to update package" });
    }
  });

  app.delete("/api/packages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }
      
      const success = await storage.deletePackage(id);
      
      if (!success) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete package" });
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const newBooking = await storage.createBooking(bookingData);
      
      // Get package details for the email
      const packageDetails = await storage.getPackageById(bookingData.packageId);
      
      // Send booking notification email to admin
      sendBookingNotificationEmail(newBooking, packageDetails)
        .then(success => {
          if (success) {
            console.log('Booking notification email sent successfully');
          } else {
            console.warn('Failed to send booking notification email');
          }
        })
        .catch(err => {
          console.error('Error sending booking notification email:', err);
        });
      
      return res.status(201).json(newBooking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/bookings", requireAuth, async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      return res.status(200).json(bookings);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  
  app.patch("/api/bookings/:id/status", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const { status } = req.body;
      if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      // Get current booking before update
      const currentBooking = await storage.getBooking(id);
      if (!currentBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Only proceed with update if status is actually changing
      if (currentBooking.status === status) {
        return res.status(200).json(currentBooking);
      }
      
      // Update the booking status
      const updatedBooking = await storage.updateBookingStatus(id, status);
      
      if (!updatedBooking) {
        return res.status(404).json({ message: "Failed to update booking" });
      }
      
      // Get package details for email
      const packageDetails = await storage.getPackageById(updatedBooking.packageId);
      
      // Send status update email to customer
      if (status !== 'pending') {
        sendBookingStatusEmail(updatedBooking, packageDetails)
          .then(success => {
            if (success) {
              console.log(`Status update email sent for booking #${id}`);
            } else {
              console.warn(`Failed to send status update email for booking #${id}`);
            }
          })
          .catch(err => {
            console.error(`Error sending status update email for booking #${id}:`, err);
          });
      }
      
      return res.status(200).json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      return res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Custom tour request routes
  app.post("/api/custom-tour", async (req, res) => {
    try {
      const requestData = insertCustomTourRequestSchema.parse(req.body);
      const newRequest = await storage.createCustomTourRequest(requestData);
      return res.status(201).json(newRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create custom tour request" });
    }
  });

  // Contact form routes
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSubmissionSchema.parse(req.body);
      const newSubmission = await storage.createContactSubmission(contactData);
      return res.status(201).json(newSubmission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Initialize an admin account if none exists
  const initDefaultAdmin = async () => {
    try {
      const admins = await storage.getAllAdmins();
      if (admins.length === 0) {
        const defaultAdmin = {
          username: "admin",
          password: auth.hashPassword("sanskruti123")
        };
        await storage.createAdmin(defaultAdmin);
        console.log("Default admin account created");
      }
    } catch (error) {
      console.error("Failed to initialize default admin", error);
    }
  };

  await initDefaultAdmin();

  const httpServer = createServer(app);
  return httpServer;
}
