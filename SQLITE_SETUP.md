# SQLite Setup Guide

## ✅ Why SQLite?

Your Sri Umadevi Tours website now uses **SQLite** instead of PostgreSQL:

- ✅ **Zero configuration** - Just works out of the box
- ✅ **File-based** - Database is a single `sqlite.db` file
- ✅ **Perfect for sparse usage** - No server needed
- ✅ **Easy to deploy** - Commit or backup the `.db` file
- ✅ **Works everywhere** - macOS, Windows, Linux
- ✅ **Full payment support** - All Razorpay features work perfectly

---

## 🚀 Quick Start (2 Steps!)

### Step 1: Copy Environment File

```bash
cp .env.example .env
```

### Step 2: Update `.env` with Your Keys

Edit `.env`:

```bash
# Database (SQLite auto-creates this file)
DATABASE_URL=sqlite.db

# Razorpay Keys
RAZORPAY_KEY_ID=rzp_live_SBb22Zn4IDPqaL
RAZORPAY_KEY_SECRET=yUXbP5uklCnCRaSO57t5JkFb
```

Edit `client/.env.local`:

```bash
VITE_RAZORPAY_KEY_ID=rzp_live_SBb22Zn4IDPqaL
```

### Step 3: Install & Run

```bash
npm install
npm run dev
```

**Done!** That's it. The database file (`sqlite.db`) will be created automatically.

---

## 📁 What is `sqlite.db`?

The `sqlite.db` file is your entire database - it contains:
- All tours
- All bookings
- All payments
- All customer inquiries
- Everything else

It's just a file, so you can:
- **Backup**: Copy `sqlite.db` to backup location
- **Share**: Email or upload the file
- **Move**: Copy to different location
- **Version**: Include in git or exclude (see .gitignore)

---

## 🔄 Migrating from PostgreSQL (If You Were Using It)

If you previously had a PostgreSQL database:

1. **Export data** from PostgreSQL (optional)
2. **Delete** old `migrations/` folder (not needed for SQLite)
3. **Run** `npm install` (installs `better-sqlite3`)
4. **Start** `npm run dev` (SQLite auto-creates fresh database)

SQLite will auto-create fresh tables. You'll need to re-seed any existing data if desired.

---

## 📊 Database Schema

All tables automatically created:
- `tours` - Tour information
- `departures` - Departure dates
- `bookings` - Customer bookings
- `payments` - Payment records
- `inquiries` - Customer inquiries
- `testimonials` - Reviews
- `admins` - Admin users
- `users` - System users

---

## 🧪 Testing

1. Open http://localhost:5000
2. Go to a tour page
3. Click "Book Now"
4. Fill in test details
5. Use test card: `4111 1111 1111 1111`
6. Complete payment
7. Check `sqlite.db` file - it now contains your booking!

---

## 💾 Backing Up Your Data

Since your database is just a file:

```bash
# Simple backup
cp sqlite.db sqlite.db.backup

# Or use Git (optional)
# Add to .git-keep if you want to track it
git add sqlite.db
git commit -m "Backup database"
```

---

## 🌍 Deployment with SQLite

### Option 1: Include `.db` File in Git (Simple)

```bash
# .gitignore
# Remove or comment out the sqlite.db line
# sqlite.db  # (leave this commented or remove it)

# Then commit
git add sqlite.db
git commit -m "Add database"
```

### Option 2: Regenerate on Deployment (Clean)

1. Keep `sqlite.db` in `.gitignore`
2. Deploy without the `.db` file
3. App auto-creates fresh database on startup
4. Your seed data is gone (good for testing)
5. Customers start fresh

### Option 3: Backup Before Deploy

```bash
# Before deploying
cp sqlite.db sqlite.db.$(date +%Y%m%d_%H%M%S).backup

# Deploy with new code
npm install
npm run build

# Database auto-creates with new schema
```

---

## 🔍 Viewing Database Contents

### Using SQLite CLI

```bash
# Open database
sqlite3 sqlite.db

# List all tables
.tables

# View bookings
SELECT * FROM bookings;

# View payments
SELECT * FROM payments;

# Exit
.quit
```

### Using SQLite Browser (GUI)

1. Download: https://sqlitebrowser.org/
2. Open File → Open → `sqlite.db`
3. Browse all tables visually

---

## 📝 Key Differences from PostgreSQL

| Feature | PostgreSQL | SQLite |
|---------|-----------|--------|
| **Setup** | Server needed | None - just a file |
| **Connection** | Network connection | File access |
| **UUIDs** | Native `gen_random_uuid()` | `lower(hex(randomblob(16)))` |
| **Boolean** | Native `boolean` | Stored as `integer` (0/1) |
| **JSON** | Native `jsonb` | Stored as `text` with JSON functions |
| **Timestamps** | Native `TIMESTAMP` | Stored as `text` ISO strings |
| **Performance** | Enterprise | Perfect for sparse usage |

---

## ⚙️ SQLite Configuration

The app auto-enables:
- **Foreign keys**: `PRAGMA foreign_keys = ON`
- **JSON functions**: Built-in
- **Auto-incrementing IDs**: UUID generation
- **Transactions**: Full support

No manual configuration needed!

---

## 🚨 Important Notes

1. **SQLite is single-threaded** - Works fine for your sparse usage
2. **Max concurrent connections** - ~1 per process (no issue for small teams)
3. **File size** - Can grow to millions of records (no concern yet)
4. **Backups** - Just copy the `.db` file
5. **Restore** - Replace `sqlite.db` with backup and restart

---

## 🎯 Production Checklist

- [ ] `.env` contains valid Razorpay keys
- [ ] `DATABASE_URL=sqlite.db` in `.env`
- [ ] `npm install` completed
- [ ] `npm run dev` works without errors
- [ ] Payment flow tested with test card
- [ ] `sqlite.db` file created successfully
- [ ] Ready to deploy!

---

## 📞 Need Help?

- SQLite docs: https://www.sqlite.org/docs.html
- SQLite Browser: https://sqlitebrowser.org/
- This guide: `SQLITE_SETUP.md`
- Razorpay: `RAZORPAY_SETUP.md`

---

## ✨ That's It!

You now have a **zero-configuration database** that works perfectly for your needs. No PostgreSQL server, no configuration complexity, just a file-based database that stores all your tour bookings and payments.

**Happy booking! 🎉**
