import { 
  users, type User, type InsertUser,
  packages, type Package, type InsertPackage, 
  bookings, type Booking, type InsertBooking,
  customTourRequests, type CustomTourRequest, type InsertCustomTourRequest,
  contactSubmissions, type ContactSubmission, type InsertContactSubmission,
  admins, type Admin, type InsertAdmin 
} from "@shared/schema";

// Storage interface with all CRUD methods
export interface IStorage {
  // Admin methods
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  getAllAdmins(): Promise<Admin[]>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  
  // Package methods
  getPackageById(id: number): Promise<Package | undefined>;
  getAllPackages(): Promise<Package[]>;
  getFeaturedPackages(): Promise<Package[]>;
  getPackagesByType(type: string): Promise<Package[]>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: number, pkg: InsertPackage): Promise<Package | undefined>;
  deletePackage(id: number): Promise<boolean>;
  
  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  getBookingsByPackageId(packageId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Custom tour request methods
  getCustomTourRequest(id: number): Promise<CustomTourRequest | undefined>;
  getAllCustomTourRequests(): Promise<CustomTourRequest[]>;
  createCustomTourRequest(request: InsertCustomTourRequest): Promise<CustomTourRequest>;
  updateCustomTourRequestStatus(id: number, status: string): Promise<CustomTourRequest | undefined>;
  
  // Contact submission methods
  getContactSubmission(id: number): Promise<ContactSubmission | undefined>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  updateContactSubmissionStatus(id: number, status: string): Promise<ContactSubmission | undefined>;
  
  // User methods (legacy from initial setup)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private admins: Map<number, Admin>;
  private packages: Map<number, Package>;
  private bookings: Map<number, Booking>;
  private customTourRequests: Map<number, CustomTourRequest>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private users: Map<number, User>;
  
  private adminId: number;
  private packageId: number;
  private bookingId: number;
  private requestId: number;
  private submissionId: number;
  private userId: number;

  constructor() {
    this.admins = new Map();
    this.packages = new Map();
    this.bookings = new Map();
    this.customTourRequests = new Map();
    this.contactSubmissions = new Map();
    this.users = new Map();
    
    this.adminId = 1;
    this.packageId = 1;
    this.bookingId = 1;
    this.requestId = 1;
    this.submissionId = 1;
    this.userId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // Initialize with sample data
  private initializeData() {
    // Create sample packages
    const samplePackages: InsertPackage[] = [
      {
        title: "Kashmir Adventure",
        description: "Experience the paradise on earth with our complete Kashmir tour package. Enjoy shikara rides, snow adventures, and traditional Kashmiri cuisine.",
        price: 45000,
        location: "Kashmir",
        duration: "7 Days / 6 Nights",
        destinations: "Srinagar, Gulmarg, Pahalgam",
        imageUrl: "https://pixabay.com/get/ge65786e9fb782ddbc7612ce67e71b40e967573c39db7cd9994f43d321f9206156cac876f221abdf0ba6d45d1355846c7e4a055564f5865b81b994cba71ae896f_1280.jpg",
        type: "national",
        featured: true,
        bestSeller: false,
        rating: 4.5,
        reviewCount: 48
      },
      {
        title: "Kerala Backwaters",
        description: "Discover God's own country with our Kerala tour. Experience houseboat stays, ayurvedic treatments, and the serene backwaters.",
        price: 38000,
        location: "Kerala",
        duration: "6 Days / 5 Nights",
        destinations: "Kochi, Munnar, Alleppey",
        imageUrl: "https://pixabay.com/get/gbd4551eb8738eabe2a83c67bb4cfd87d72edf7f623c7194af43d75037b5f8802c82a2b1e8629ac4defcd931002eae2de5410e2b602456ad36af72528010b572b_1280.jpg",
        type: "national",
        featured: false,
        bestSeller: false,
        rating: 5.0,
        reviewCount: 63
      },
      {
        title: "European Escapade",
        description: "Experience the best of Europe with our multi-city tour. From the Eiffel Tower to Colosseum and Sagrada Familia, explore Europe's iconic landmarks.",
        price: 125000,
        location: "Europe",
        duration: "10 Days / 9 Nights",
        destinations: "Paris, Rome, Barcelona",
        imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        type: "international",
        featured: true,
        bestSeller: true,
        rating: 4.7,
        reviewCount: 129
      },
      {
        title: "Golden Triangle Tour",
        description: "Explore the rich history and culture of India's Golden Triangle. Visit iconic landmarks like the Taj Mahal, Amber Fort, and Qutub Minar.",
        price: 32500,
        location: "North India",
        duration: "6 Days / 5 Nights",
        destinations: "Delhi, Agra, Jaipur",
        imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        type: "national",
        featured: false,
        bestSeller: true,
        rating: 4.6,
        reviewCount: 87
      },
      {
        title: "Goa Beach Vacation",
        description: "Enjoy the sun, sand, and sea in Goa. Experience the vibrant beach culture, water sports, and nightlife.",
        price: 28000,
        location: "Goa",
        duration: "5 Days / 4 Nights",
        destinations: "North & South Goa",
        imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        type: "national",
        featured: false,
        bestSeller: false,
        rating: 4.3,
        reviewCount: 56
      },
      {
        title: "Dubai Extravaganza",
        description: "Discover the ultramodern city of Dubai with its incredible architecture, luxury shopping, and desert adventures.",
        price: 75000,
        location: "UAE",
        duration: "6 Days / 5 Nights",
        destinations: "Dubai, Abu Dhabi",
        imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        type: "international",
        featured: false,
        bestSeller: false,
        rating: 4.8,
        reviewCount: 92
      },
      {
        title: "Bali Paradise",
        description: "Experience the tropical paradise of Bali with its beautiful beaches, volcanic mountains, and unique cultural heritage.",
        price: 68000,
        location: "Indonesia",
        duration: "7 Days / 6 Nights",
        destinations: "Kuta, Ubud, Seminyak",
        imageUrl: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        type: "international",
        featured: true,
        bestSeller: false,
        rating: 4.9,
        reviewCount: 108
      },
      {
        title: "Singapore Explorer",
        description: "Discover the vibrant city-state of Singapore with its futuristic architecture, diverse food scene, and world-class attractions.",
        price: 82000,
        location: "Singapore",
        duration: "5 Days / 4 Nights",
        destinations: "Singapore City, Sentosa Island",
        imageUrl: "https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        type: "international",
        featured: false,
        bestSeller: false,
        rating: 4.7,
        reviewCount: 73
      }
    ];

    // Add sample packages
    samplePackages.forEach(pkg => {
      this.createPackage(pkg);
    });
  }

  // Admin methods
  async getAdmin(id: number): Promise<Admin | undefined> {
    return this.admins.get(id);
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(
      (admin) => admin.username === username,
    );
  }

  async getAllAdmins(): Promise<Admin[]> {
    return Array.from(this.admins.values());
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const id = this.adminId++;
    const newAdmin: Admin = { ...admin, id };
    this.admins.set(id, newAdmin);
    return newAdmin;
  }

  // Package methods
  async getPackageById(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async getAllPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async getFeaturedPackages(): Promise<Package[]> {
    return Array.from(this.packages.values()).filter(
      (pkg) => pkg.featured,
    );
  }

  async getPackagesByType(type: string): Promise<Package[]> {
    return Array.from(this.packages.values()).filter(
      (pkg) => pkg.type === type,
    );
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const id = this.packageId++;
    const now = new Date();
    const newPackage: Package = { 
      ...pkg, 
      id,
      createdAt: now,
      updatedAt: now 
    };
    this.packages.set(id, newPackage);
    return newPackage;
  }

  async updatePackage(id: number, pkg: InsertPackage): Promise<Package | undefined> {
    const existingPackage = this.packages.get(id);
    if (!existingPackage) {
      return undefined;
    }
    
    const updatedPackage: Package = { 
      ...existingPackage,
      ...pkg,
      id,
      updatedAt: new Date()
    };
    
    this.packages.set(id, updatedPackage);
    return updatedPackage;
  }

  async deletePackage(id: number): Promise<boolean> {
    if (!this.packages.has(id)) {
      return false;
    }
    return this.packages.delete(id);
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingsByPackageId(packageId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.packageId === packageId,
    );
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const now = new Date();
    const newBooking: Booking = { 
      ...booking, 
      id,
      createdAt: now
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) {
      return undefined;
    }
    
    const updatedBooking: Booking = { 
      ...booking,
      status
    };
    
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Custom tour request methods
  async getCustomTourRequest(id: number): Promise<CustomTourRequest | undefined> {
    return this.customTourRequests.get(id);
  }

  async getAllCustomTourRequests(): Promise<CustomTourRequest[]> {
    return Array.from(this.customTourRequests.values());
  }

  async createCustomTourRequest(request: InsertCustomTourRequest): Promise<CustomTourRequest> {
    const id = this.requestId++;
    const now = new Date();
    const newRequest: CustomTourRequest = { 
      ...request, 
      id,
      status: "pending",
      createdAt: now
    };
    this.customTourRequests.set(id, newRequest);
    return newRequest;
  }

  async updateCustomTourRequestStatus(id: number, status: string): Promise<CustomTourRequest | undefined> {
    const request = this.customTourRequests.get(id);
    if (!request) {
      return undefined;
    }
    
    const updatedRequest: CustomTourRequest = { 
      ...request,
      status
    };
    
    this.customTourRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  // Contact submission methods
  async getContactSubmission(id: number): Promise<ContactSubmission | undefined> {
    return this.contactSubmissions.get(id);
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.submissionId++;
    const now = new Date();
    const newSubmission: ContactSubmission = { 
      ...submission, 
      id,
      status: "unread",
      createdAt: now
    };
    this.contactSubmissions.set(id, newSubmission);
    return newSubmission;
  }

  async updateContactSubmissionStatus(id: number, status: string): Promise<ContactSubmission | undefined> {
    const submission = this.contactSubmissions.get(id);
    if (!submission) {
      return undefined;
    }
    
    const updatedSubmission: ContactSubmission = { 
      ...submission,
      status
    };
    
    this.contactSubmissions.set(id, updatedSubmission);
    return updatedSubmission;
  }

  // User methods (legacy from initial setup)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
