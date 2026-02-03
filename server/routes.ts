import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertTestimonialSchema, insertBookingSchema, insertPaymentSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import Razorpay from "razorpay";
import crypto from "crypto";

declare module "express-session" {
  interface SessionData {
    adminId?: string;
    adminName?: string;
  }
}

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.adminId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/tours", async (req, res) => {
    try {
      const tours = await storage.getTours();
      res.json(tours);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tours" });
    }
  });

  app.get("/api/tours/:slug", async (req, res) => {
    try {
      const tour = await storage.getTourBySlug(req.params.slug);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      res.json(tour);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour" });
    }
  });

  app.get("/api/tours/:slug/departures", async (req, res) => {
    try {
      const tour = await storage.getTourBySlug(req.params.slug);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      const departures = await storage.getDeparturesByTourId(tour.id);
      res.json(departures);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch departures" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  app.get("/api/testimonials/featured", async (req, res) => {
    try {
      const testimonials = await storage.getFeaturedTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const admin = await storage.getAdminByUsername(username);
      
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, admin.password);
      
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!admin.isActive) {
        return res.status(401).json({ message: "Account is disabled" });
      }

      req.session.adminId = admin.id;
      req.session.adminName = admin.name || admin.username;
      
      res.json({ message: "Login successful", admin: { id: admin.id, name: admin.name, username: admin.username } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/admin/session", (req, res) => {
    if (req.session.adminId) {
      res.json({ adminId: req.session.adminId, adminName: req.session.adminName });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  app.get("/api/admin/inquiries", requireAdmin, async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.patch("/api/admin/inquiries/:id", requireAdmin, async (req, res) => {
    try {
      const inquiry = await storage.updateInquiry(req.params.id, req.body);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inquiry" });
    }
  });

  app.get("/api/admin/testimonials", requireAdmin, async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.patch("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
    try {
      const testimonial = await storage.updateTestimonial(req.params.id, req.body);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  app.get("/api/admin/bookings", requireAdmin, async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const tours = await storage.getTours();
      const inquiries = await storage.getInquiries();
      const testimonials = await storage.getTestimonials();
      const bookings = await storage.getBookings();

      res.json({
        totalTours: tours.length,
        totalInquiries: inquiries.length,
        newInquiries: inquiries.filter((i) => i.status === "new").length,
        totalTestimonials: testimonials.length,
        totalBookings: bookings.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Payment endpoints
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Create Razorpay order
  app.post("/api/payments/create-order", async (req, res) => {
    try {
      const { amount, customerEmail, customerPhone, bookingId, tourName } = req.body;

      if (!amount || !customerEmail || !customerPhone) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Amount should be in paise (multiply by 100)
      const amountInPaise = Math.round(amount * 100);

      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          bookingId,
          tourName,
          customerEmail,
          customerPhone,
        },
      });

      // Save payment record to database
      const payment = await storage.createPayment({
        razorpayOrderId: order.id,
        amount: amountInPaise,
        currency: "INR",
        customerEmail,
        customerPhone,
        status: "pending",
        notes: {
          bookingId,
          tourName,
        },
      });

      res.json({
        orderId: order.id,
        amount: amountInPaise,
        currency: "INR",
        paymentId: payment.id,
      });
    } catch (error) {
      console.error("Order creation failed:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Verify payment
  app.post("/api/payments/verify", async (req, res) => {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({ message: "Missing payment verification details" });
      }

      // Verify signature
      const text = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(text)
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }

      // Update payment record
      const payment = await storage.getPaymentByRazorpayOrderId(razorpayOrderId);
      if (!payment) {
        return res.status(404).json({ message: "Payment record not found" });
      }

      const updatedPayment = await storage.updatePayment(payment.id, {
        razorpayPaymentId,
        razorpaySignature,
        status: "captured",
      });

      // Update booking status if bookingId exists
      if (bookingId) {
        await storage.updateBooking(bookingId, {
          paymentStatus: "completed",
          paidAmount: payment.amount / 100, // Convert back to rupees
        });
      }

      res.json({
        message: "Payment verified successfully",
        payment: updatedPayment,
      });
    } catch (error) {
      console.error("Payment verification failed:", error);
      res.status(500).json({ message: "Payment verification failed" });
    }
  });

  // Get payment status
  app.get("/api/payments/:orderId", async (req, res) => {
    try {
      const payment = await storage.getPaymentByRazorpayOrderId(req.params.orderId);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment" });
    }
  });

  app.get("/api/admin/payments", requireAdmin, async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  return httpServer;
}
