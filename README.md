# Prime Estate Marketplace

A full-stack real-estate marketplace built with Node.js, Express, MongoDB, React, Vite, Redux, and Tailwind CSS.

Developed by Youssef Emad Kamel.

## Overview

This project allows users to:

- browse property listings
- search and filter homes by type, offer status, and price
- sign up and sign in securely
- create and manage their own listings
- edit or delete listings from their profile
- upload property images using Cloudinary
- view detailed listing information and landlord contact details

It is designed as a modern marketplace MVP for buying, selling, and renting homes.

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication with secure cookies
- Cloudinary integration for image uploads
- bcryptjs for password hashing

### Frontend

- React
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS

## Project Structure

```bash
real-estate-marketplace/
├── api/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── seed.js
├── client/
│   ├── src/
│   ├── public/
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env
├── LICENSE
├── package.json
├── README.md
└── package-lock.json
```

## Features

- Home page with featured offers, rent listings, and sale listings
- Search and filter page
- Detailed listing page with gallery and property summary
- Protected routes for authenticated users
- User profile page with account info and listings
- Listing creation and editing form
- Cloudinary upload support for up to multiple images
- Demo/seed database generation for screenshots and testing

## Environment Variables

Create and configure the required environment files before running the app.

### Root project .env

Used by the backend for MongoDB and JWT.

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### api/.env

Used for Cloudinary server-side config.

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### client/.env

Used by Vite for frontend Cloudinary upload preset.

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

> Important: keep API secrets only on the backend. Do not place secret keys in the frontend environment file.

## Cloudinary Setup

1. Create a Cloudinary account.
2. Create an unsigned upload preset.
3. Add the preset name to `client/.env` as `VITE_CLOUDINARY_UPLOAD_PRESET`.
4. Use the same Cloud name in both backend and frontend config.

If the preset is not found, the upload form will fail. You can create a new preset in Cloudinary and update the value in the frontend `.env` file.

## Database Seeding

This project includes a demo seeder that creates one demo user and multiple sample listings for screenshots and local testing.

From the project root:

```bash
npm run seed
```

This creates:

- demo user
- sample property listings
- realistic landlord contact text for each listing

Demo login:

- Email: demo@primeestate.com
- Password: demo1234

## Running the App

### 1) Install dependencies

At the project root:

```bash
npm install
```

Then in the client folder:

```bash
cd client
npm install
```

### 2) Start the backend

From the project root:

```bash
npm run dev
```

### 3) Start the frontend

In a separate terminal:

```bash
cd client
npm run dev
```

The app should run with the frontend on the Vite local dev server and the backend on your Express server.

## Build for Production

Frontend build:

```bash
cd client
npm run build
```

## Authentication Flow

The app uses JWT tokens stored in secure HTTP-only cookies.

- user signs in or signs up
- server creates a JWT
- token is sent in a cookie
- protected routes verify the user from the cookie
- only the owner can update or delete their own listings

## Listing Model Notes

Each listing includes:

- name
- description
- address
- regular price
- discount price
- bedrooms
- bathrooms
- parking status
- furnished status
- type (rent or sale)
- offer status
- image URLs
- landlord contact info (plain text)
- user reference

Developed by Youssef Emad Kamel
All rights reserved – 2026
