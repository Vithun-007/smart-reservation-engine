# Smart Reservation Engine

A distributed inventory reservation platform built using Next.js, Prisma, PostgreSQL, and Supabase.

This project simulates a real-world enterprise inventory reservation system with multi-warehouse stock allocation, concurrency-safe reservations, reservation lifecycle management, and professional dashboard-style UI/UX.

---

# Live Demo

https://smart-reservation-engine-h7o2-diiwd88uk-vithun-s-projects.vercel.app/

---

# GitHub Repository

https://github.com/Vithun-007/smart-reservation-engine

---

# Features

## Inventory Management
- Multi-product inventory system
- Multi-warehouse stock allocation
- Real-time stock visibility
- Warehouse-wise inventory distribution
- Inventory tracking dashboard
- Reserved stock monitoring

---

## Reservation System
- Reserve inventory
- Confirm reservations
- Release reservations
- Reservation expiry handling
- Reservation lifecycle management
- Reservation detail page
- Reservation status updates

---

## Concurrency Handling
- Database transactions using Prisma
- PostgreSQL row-level locking
- Prevents overselling
- Concurrent-safe reservation flow
- Transaction-safe inventory updates

---

## UI/UX
- Enterprise dashboard UI
- Professional dark theme
- Responsive design
- Search and filtering
- Product analytics cards
- Reservation checkout interface
- Toast notifications
- Modern inventory cards
- Live operational status indicators

---

# Tech Stack

## Frontend
- Next.js 15
- React
- Tailwind CSS
- TypeScript

---

## Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Supabase

---

## Additional Libraries
- Sonner
- Lucide React

---

# Architecture Overview

The system uses a distributed inventory architecture where inventory is allocated across multiple warehouses.

When a reservation request is created:

1. Inventory is searched across warehouses
2. Database transaction begins
3. Row-level lock is acquired
4. Inventory is revalidated safely
5. Reserved stock is updated
6. Reservation record is created

This prevents:
- Race conditions
- Overselling
- Concurrent reservation conflicts

---

# API Endpoints

## Products

```bash
GET /api/products