# Picstore - Simple Architecture Guide

## What is this application?

An app that lets users take photos of plants and animals, organize them into categories (like Trees, Birds, Insects), and build their own personal species catalog. Works on mobile phones now, with a desktop version coming later.

---

## How it works - The Big Picture

```
[Mobile App] ←→ [Spring Boot Backend] ←→ [Database]
                         ↓
                   [Image Storage]
```

**Mobile App** → User takes photos and enters species info  
**Backend** → Handles all the logic and data management  
**Database** → Stores species information and user data  
**Image Storage** → Stores all the photos (separate cloud service)

---

## Main Components

### 1. Mobile App (Expo/React Native)
**What it does:**
- Take photos with the camera
- Fill in species details (name, notes, location)
- Organize species into categories
- View your collection
- Works offline, syncs when online

### 2. Backend API (Spring Boot)
**What it does:**
- User login and accounts
- Save and retrieve species data
- Upload images to cloud storage
- Search and filter species
- Keep everything secure

### 3. Database (PostgreSQL or MySQL)
**What it stores:**
- User accounts
- Species entries (names, descriptions, dates)
- Categories (Trees, Birds, etc.)
- Links to where images are stored

### 4. Image Storage (AWS S3 / Cloudinary / Azure)
**What it stores:**
- All the photos users take
- Smaller thumbnail versions for quick loading
- Delivers images fast using CDN

---

## How data flows through the system

### Taking and saving a photo:
1. User takes photo in the app
2. App sends photo to the backend
3. Backend uploads photo to cloud storage
4. Backend saves the photo's location in the database
5. User can now see their photo in the app

### Creating a species entry:
1. User fills in species information
2. User picks a category (e.g., "Trees")
3. User attaches photos they took earlier
4. Backend saves everything to the database
5. Entry appears in user's catalog

### Using on different devices:
- Same account works on any device
- All data is stored in the cloud
- Mobile app can sync when internet available
- Desktop app (future) will access the same data

---

## Technology choices

| Part | Technology | Why? |
|------|------------|------|
| **Mobile App** | Expo (React Native) | Build for iOS and Android at once |
| **Backend** | Spring Boot (Java) | Reliable, secure, good for business apps |
| **Database** | PostgreSQL or MySQL | Standard choice for storing structured data |
| **Image Storage** | AWS S3 or Cloudinary | Designed for storing lots of images |

---

## Key Features

**For Users:**
- ✓ Take photos of species
- ✓ Add names, descriptions, notes
- ✓ Organize by categories
- ✓ Search and filter your collection
- ✓ Work offline, sync later
- ✓ Location tracking (where you found it)
- ✓ Date tracking (when you found it)

**Behind the scenes:**
- ✓ Secure login system
- ✓ Each user has their own private collection
- ✓ Fast image loading
- ✓ Handles many users at once
- ✓ Regular backups

---

## Data structure (simplified)

**User**
- Username, email, password
- Profile information

**Species Entry**
- Name (common and scientific)
- Description and notes
- Category (Tree, Bird, etc.)
- Location found
- Date observed
- Who created it
- Photos attached

**Category**
- Category name
- Icon/description

**Image**
- Where it's stored (URL)
- Thumbnail version
- Which species it belongs to
- Upload date

---

## Security basics

- **Passwords:** Encrypted, never stored in plain text
- **Login:** Secure tokens (JWT) that expire
- **Images:** Private storage, only accessible to the owner
- **Connection:** All data encrypted in transit (HTTPS)
- **Validation:** Backend checks all data before saving

---

## Future plans

### Phase 1 (Current)
- Mobile app with basic features
- Photo upload and cataloging
- Categories and search

### Phase 2 (Next)
- Desktop application
- Batch upload multiple photos
- Better analytics and reports
- Export data

### Phase 3 (Future)
- Share observations with friends
- Community features
- AI to help identify species
- Field guide generation

---

## Common questions

**Q: Where are the images stored?**  
A: On a cloud storage service (like AWS S3), not in the database. The database only stores the link to the image.

**Q: Can I use the app offline?**  
A: Yes! You can take photos and enter data offline. It will sync when you have internet.

**Q: Is my data private?**  
A: Yes. Each user has their own account and only they can see their species catalog.

**Q: Will mobile and desktop share the same data?**  
A: Yes. Both use the same backend, so your catalog is available everywhere.

**Q: How many photos can I upload?**  
A: Limited only by storage limits we set. Multiple photos per species are supported.

**Q: Can I organize species into my own categories?**  
A: Categories are predefined (Trees, Birds, etc.) but you can add custom tags and notes.

---

## Technical summary

**Architecture type:** Three-tier architecture  
- Presentation tier (Mobile/Desktop apps)
- Application tier (Spring Boot API)
- Data tier (Database + Image Storage)

**Communication:** REST API with JSON  
**Authentication:** JWT tokens  
**Deployment:** Cloud-based, containerized  

---

**Version:** 1.0  
**Last updated:** March 2026  
**Status:** Ready for development
