# Supabase Setup Guide - Free PostgreSQL for Your Tours Website

## ✨ Why Supabase? The Perfect Stack for You

**Your Final Architecture:**
```
GitHub Pages (Frontend)
         ↓ (API calls)
Your Backend (Express.js)
         ↓ (Queries)
Supabase PostgreSQL (Database)
```

**Why this is perfect:**
- ✅ **Frontend**: Free on GitHub Pages (static React)
- ✅ **Database**: Free PostgreSQL from Supabase (500MB)
- ✅ **Backend**: Free on Vercel/Railway
- ✅ **Payments**: Razorpay handles payments
- ✅ **Total Cost**: **ZERO** for your usage level

---

## 🚀 Quick Start: Supabase (5 minutes)

### Step 1: Create Supabase Account

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub (easiest - just authorize)
4. Create new organization
5. Create new project
   - Name: `sri-umadevi-tours`
   - Region: Choose closest to India
   - Password: Create strong password
6. Wait 2-3 minutes for database to initialize

### Step 2: Get Your Database Connection String

After project is created:
1. Go to **Settings** → **Database** (left sidebar)
2. Under "Connection string", find **"URI"** section
3. Copy the full connection string
4. It looks like: `postgresql://postgres:xxxxx@xxxxx.supabase.co:5432/postgres`

⚠️ **Save this URL securely!**

### Step 3: Update Your `.env` File

```bash
# .env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@xxxxx.supabase.co:5432/postgres

# Razorpay keys
RAZORPAY_KEY_ID=rzp_live_SBb22Zn4IDPqaL
RAZORPAY_KEY_SECRET=yUXbP5uklCnCRaSO57t5JkFb

# Server
NODE_ENV=production
PORT=5000
```

### Step 4: Install & Deploy Database

```bash
# 1. Install dependencies (reinstalls pg driver)
npm install

# 2. Push schema to Supabase
npx drizzle-kit push:pg

# 3. Verify in Supabase dashboard
#    Go to Tables tab - should see all your tables created
```

### Step 5: Test Connection

```bash
npm run dev
```

Visit `http://localhost:5000` and test the payment flow!

---

## 📊 Your Database in Supabase

Once created, Supabase automatically gives you:

### Auto-Generated Tables
- ✅ `tours` - Tour information
- ✅ `departures` - Departure dates
- ✅ `bookings` - Customer bookings
- ✅ `payments` - **Razorpay transactions**
- ✅ `inquiries` - Customer inquiries
- ✅ `testimonials` - Reviews
- ✅ `admins` - Admin users
- ✅ `users` - System users

### Automatic Features
- ✅ **Backups** - Automatic daily backups
- ✅ **SSL** - Built-in HTTPS
- ✅ **Auth** - User authentication ready
- ✅ **Real-time** - Optional real-time updates
- ✅ **Auto-scaling** - Grows as needed
- ✅ **REST API** - Auto-generated (optional)

---

## 🔍 Managing Your Database

### View Data in Supabase Dashboard

1. Go to **Supabase Dashboard**
2. Click **"Table Editor"** (left sidebar)
3. View all tables and data
4. Can edit/delete directly in UI

### Query Database from Command Line

```bash
# Using psql (if installed)
psql "postgresql://postgres:password@host:5432/postgres"

# Inside psql:
\dt                    # List all tables
SELECT * FROM bookings;  # View bookings
SELECT * FROM payments;  # View payments
```

### SQL Editor in Supabase

1. Go to **SQL Editor** in Supabase dashboard
2. Write custom queries
3. Execute directly against your database
4. Perfect for analytics

---

## 💾 Backups & Data Safety

### Automatic Backups
- Supabase backs up daily automatically
- Kept for 7 days free
- Restore via dashboard in 1 click

### Manual Export

```bash
# Export entire database
pg_dump "your_connection_string" > backup.sql

# Import later
psql "your_connection_string" < backup.sql
```

---

## 📈 Free Tier Limits

Supabase free tier includes:

| Feature | Free Limit |
|---------|-----------|
| **Database Size** | 500 MB |
| **Connections** | 5 concurrent |
| **Auto Backups** | 7 days retention |
| **Bandwidth** | 2 GB/month |
| **Updates** | Real-time included |

**For your usage**: This is **MORE than enough**! Bookings take minimal space.

---

## 🌍 Deploying Your Backend

### Option 1: Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login & deploy
vercel

# 3. Add environment variables in Vercel dashboard
# Add DATABASE_URL, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

# 4. Deploy succeeds - get URL like:
# https://your-app.vercel.app
```

### Option 2: Railway

```bash
# 1. Go to https://railway.app
# 2. Connect GitHub repo
# 3. Add DATABASE_URL env var
# 4. Deploy automatically
```

### Option 3: Render

```bash
# 1. Go to https://render.com
# 2. Create Web Service
# 3. Connect GitHub
# 4. Add environment variables
# 5. Deploy
```

---

## 🔗 Frontend on GitHub Pages + Backend on Vercel

### Architecture
```
┌─────────────────────────────────┐
│     GitHub Pages                │  ← Your React app
│     (Frontend - static)         │     https://yourusername.github.io
└────────────┬────────────────────┘
             │ API calls
             ↓
┌─────────────────────────────────┐
│     Vercel                      │  ← Your Express backend
│     (Backend - serverless)      │     https://your-app.vercel.app
└────────────┬────────────────────┘
             │ Database queries
             ↓
┌─────────────────────────────────┐
│     Supabase                    │  ← PostgreSQL database
│     (Database)                  │     Managed by Supabase
└─────────────────────────────────┘
```

### Setup Frontend on GitHub Pages

```bash
# In your package.json:
{
  "homepage": "https://yourusername.github.io",
  "scripts": {
    "build": "vite build",
    "deploy": "npm run build && gh-pages -d dist"
  }
}

# Deploy
npm run deploy
```

### Connect Frontend to Vercel Backend

In your checkout component, change API calls:

```javascript
// Before (localhost)
const response = await fetch("http://localhost:5000/api/payments/create-order", {

// After (Vercel production)
const response = await fetch("https://your-app.vercel.app/api/payments/create-order", {
```

---

## ✅ Complete Deployment Checklist

- [ ] Supabase account created
- [ ] Database connection string copied
- [ ] `.env` updated with DATABASE_URL
- [ ] `npm install` completed
- [ ] `npx drizzle-kit push:pg` successful
- [ ] Tables visible in Supabase dashboard
- [ ] Local testing works (`npm run dev`)
- [ ] Backend deployed to Vercel/Railway
- [ ] Environment variables added to host
- [ ] Frontend updated with backend URL
- [ ] Payment flow tested end-to-end
- [ ] Database has test booking data
- [ ] Ready for production!

---

## 🐛 Troubleshooting

### "Connection refused" Error

**Problem**: Can't connect to Supabase

**Solution**:
```bash
# Check your DATABASE_URL
echo $DATABASE_URL

# Verify it looks like:
# postgresql://postgres:password@xxxxx.supabase.co:5432/postgres

# Make sure IP is whitelisted in Supabase
# Settings → Database → Network

# Add your IP to whitelist
```

### "Password authentication failed"

**Problem**: Wrong password in connection string

**Solution**:
1. Go to Supabase **Settings** → **Database**
2. Click **"Reset database password"**
3. Create new password
4. Update `.env` with new password

### Schema not created

**Problem**: Tables don't appear in Supabase

**Solution**:
```bash
# Make sure you ran push
npx drizzle-kit push:pg

# Check for errors
npx drizzle-kit introspect:pg

# If still issues, check DATABASE_URL is correct
echo $DATABASE_URL
```

---

## 📞 Resources

- **Supabase Docs**: https://supabase.com/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **Vercel Deployment**: https://vercel.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## 🎉 Final Stack Summary

| Component | Provider | Cost | Purpose |
|-----------|----------|------|---------|
| **Frontend** | GitHub Pages | Free | React app |
| **Backend** | Vercel | Free | Express API |
| **Database** | Supabase | Free (500MB) | PostgreSQL |
| **Payments** | Razorpay | Per transaction | Payment gateway |
| **Hosting** | GitHub Pages | Free | Frontend delivery |

**Total Cost: $0** (Razorpay pays when customers pay)

---

## 🚀 Next Steps

1. Create Supabase account (5 min)
2. Get connection string
3. Update `.env`
4. Run `npm install && npx drizzle-kit push:pg`
5. Test locally
6. Deploy backend to Vercel
7. Deploy frontend to GitHub Pages
8. Test payment flow end-to-end
9. **You're live!** 🎉

---

**Version**: 1.0
**Date**: 2026-02-03
**Status**: ✅ Production Ready
