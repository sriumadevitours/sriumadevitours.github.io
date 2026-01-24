# Sri Umadevi Tours - Spiritual Pilgrimage Booking Platform

## Overview
A modern spiritual tour booking platform for Sri Umadevi Tours, specializing in sacred pilgrimages including Kailash Manasarovar, Chardham Yatra, 12 Jyotirlinga, and Divya Desam temples. The platform uses an inquiry-based booking system (no payment gateway) suitable for the Indian market.

## Current State
- **Status**: MVP Complete
- **Last Updated**: January 2026

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with Vite
- **Routing**: Wouter
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with custom spiritual theme (saffron/orange color scheme)
- **UI Components**: Shadcn/UI component library

### Backend (Express + TypeScript)
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with express-session
- **Password Hashing**: bcryptjs

### Database Schema
- `tours` - Tour packages with itineraries, pricing, inclusions/exclusions
- `departures` - Fixed departure dates per tour
- `inquiries` - Customer inquiries from website forms
- `testimonials` - Customer reviews and ratings
- `admins` - Admin users for dashboard access
- `bookings` - Confirmed bookings (created from inquiries)

## Key Pages

### Public
- `/` - Home page with hero, featured tours, testimonials
- `/tours` - Tour listing with filters
- `/tours/:slug` - Tour detail with itinerary, pricing, inquiry form
- `/about` - About the company
- `/contact` - Contact information and inquiry form

### Admin
- `/admin/login` - Admin login (username: admin, password: admin123)
- `/admin` - Dashboard with stats and recent activity
- `/admin/inquiries` - Manage customer inquiries
- `/admin/tours` - View tour packages
- `/admin/testimonials` - Manage testimonials
- `/admin/bookings` - View confirmed bookings

## User Preferences
- Company Name: Sri Umadevi Tours (not "Sria Made Tours")
- Contact: +91 95816 08979, sriumadevitravels1@gmail.com
- Location: Secunderabad, beside Sri Subramanya Swami Temple
- No Stripe/payment gateway (inquiry-based booking only)
- No Replit Auth (simple admin username/password)

## Running the Project
- Development: `npm run dev` (runs on port 5000)
- Database push: `npm run db:push`
- Seed data: `npx tsx server/seed.ts`

## Color Theme
Primary: Saffron/Orange (HSL 25 85% 50%)
Accent: Golden (HSL 45 80% 55%)
Fonts: Poppins (body), Playfair Display (headings)
