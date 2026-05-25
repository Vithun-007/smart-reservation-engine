# Smart Reservation Engine

A distributed inventory reservation system built using Next.js, Prisma, PostgreSQL, and Supabase.

This project simulates a real-world inventory reservation platform with multi-warehouse stock allocation, reservation lifecycle management, concurrency-safe transactions, and enterprise-style UI/UX.

---

# Features

## Inventory Management
- Multi-product inventory system
- Multi-warehouse stock allocation
- Real-time stock visibility
- Warehouse-wise inventory distribution

## Reservation System
- Reserve inventory
- Confirm reservations
- Release reservations
- Reservation expiry handling
- Auto inventory restoration

## Concurrency Handling
- Database transactions using Prisma
- Row-level locking using PostgreSQL
- Prevents overselling
- Concurrent-safe reservation flow

## UI/UX
- Enterprise dashboard UI
- Professional dark theme
- Product analytics
- Warehouse distribution view
- Reservation checkout page
- Toast notifications
- Search and filtering

---

# Tech Stack

## Frontend
- Next.js 15
- React
- Tailwind CSS
- TypeScript

## Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Supabase

## Additional Libraries
- Sonner
- Lucide React

---

# Architecture Overview

The system uses a distributed inventory model where products are stored across multiple warehouses.

When a reservation request is created:
1. Inventory is searched across warehouses
2. Database transaction begins
3. Row-level lock is acquired
4. Stock is validated safely
5. Reserved stock is updated
6. Reservation is created

This prevents race conditions and overselling during concurrent reservations.

---

# API Endpoints

## Products
```bash
GET /api/products