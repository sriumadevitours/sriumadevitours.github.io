import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tours = pgTable("tours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  category: text("category").notNull(),
  highlights: text("highlights").array().notNull(),
  pricePerPerson: integer("price_per_person").notNull(),
  originalPrice: integer("original_price"),
  maxAltitude: text("max_altitude"),
  difficulty: text("difficulty"),
  imageUrl: text("image_url"),
  galleryImages: text("gallery_images").array(),
  inclusions: text("inclusions").array().notNull(),
  exclusions: text("exclusions").array().notNull(),
  itinerary: jsonb("itinerary").notNull().$type<ItineraryDay[]>(),
  requirements: text("requirements").array(),
  cancellationPolicy: text("cancellation_policy"),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  isPremium: boolean("is_premium").default(false),
  sortOrder: integer("sort_order").default(0),
});

export const departures = pgTable("departures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tourId: varchar("tour_id").notNull().references(() => tours.id),
  departureDate: timestamp("departure_date").notNull(),
  returnDate: timestamp("return_date"),
  availableSeats: integer("available_seats").notNull(),
  totalSeats: integer("total_seats").notNull(),
  priceOverride: integer("price_override"),
  status: text("status").default("upcoming"),
  notes: text("notes"),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tourId: varchar("tour_id").references(() => tours.id),
  tourName: text("tour_name"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  numberOfTravelers: integer("number_of_travelers").default(1),
  preferredDate: text("preferred_date"),
  message: text("message"),
  source: text("source").default("website"),
  status: text("status").default("new"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tourId: varchar("tour_id").references(() => tours.id),
  tourName: text("tour_name"),
  name: text("name").notNull(),
  location: text("location"),
  rating: integer("rating").notNull().default(5),
  review: text("review").notNull(),
  photoUrl: text("photo_url"),
  year: text("year"),
  isApproved: boolean("is_approved").default(false),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  inquiryId: varchar("inquiry_id").references(() => inquiries.id),
  tourId: varchar("tour_id").references(() => tours.id),
  departureId: varchar("departure_id").references(() => departures.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  numberOfTravelers: integer("number_of_travelers").notNull(),
  totalAmount: integer("total_amount").notNull(),
  paidAmount: integer("paid_amount").default(0),
  paymentStatus: text("payment_status").default("pending"),
  bookingStatus: text("booking_status").default("confirmed"),
  specialRequests: text("special_requests"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => bookings.id),
  razorpayOrderId: text("razorpay_order_id").notNull().unique(),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  amount: integer("amount").notNull(),
  currency: text("currency").default("INR"),
  status: text("status").default("pending"),
  paymentMethod: text("payment_method"),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  errorCode: text("error_code"),
  errorDescription: text("error_description"),
  receiptNumber: text("receipt_number"),
  notes: jsonb("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const toursRelations = relations(tours, ({ many }) => ({
  departures: many(departures),
  inquiries: many(inquiries),
  testimonials: many(testimonials),
  bookings: many(bookings),
}));

export const departuresRelations = relations(departures, ({ one }) => ({
  tour: one(tours, {
    fields: [departures.tourId],
    references: [tours.id],
  }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  tour: one(tours, {
    fields: [inquiries.tourId],
    references: [tours.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  tour: one(tours, {
    fields: [testimonials.tourId],
    references: [tours.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  tour: one(tours, {
    fields: [bookings.tourId],
    references: [tours.id],
  }),
  departure: one(departures, {
    fields: [bookings.departureId],
    references: [departures.id],
  }),
  inquiry: one(inquiries, {
    fields: [bookings.inquiryId],
    references: [inquiries.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}));

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  distance?: string;
  duration?: string;
  meals?: string;
  accommodation?: string;
}

export const insertTourSchema = createInsertSchema(tours).omit({ id: true });
export const insertDepartureSchema = createInsertSchema(departures).omit({ id: true });
export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true, createdAt: true });
export const insertAdminSchema = createInsertSchema(admins).omit({ id: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true, updatedAt: true });

export type Tour = typeof tours.$inferSelect;
export type InsertTour = z.infer<typeof insertTourSchema>;
export type Departure = typeof departures.$inferSelect;
export type InsertDeparture = z.infer<typeof insertDepartureSchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
