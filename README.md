# Rent & Flatmate Finder

A full-stack web application where owners list rooms and tenants find compatible rooms using an AI-powered compatibility engine.

## Live Demo
- **Frontend:** https://rent-flatmate-finder-git-main-asthadixit00s-projects.vercel.app
- **Backend API:** https://rent-flatmate-finder-my20.onrender.com

## Tech Stack
- **Frontend:** React, Vite, React Router, Axios, Socket.IO Client
- **Backend:** Node.js, Express.js, MongoDB Atlas, JWT, Socket.IO, Cloudinary, Nodemailer
- **AI:** Groq LLM (llama3-8b-8192) with rule-based fallback

## Setup

```bash
# Backend
cd server
npm install
cp .env.example .env
npm run dev

# Frontend
cd client
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

### server/.env.example

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=your_groq_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
EMAIL_USER=your_gmail_here
EMAIL_PASS=your_gmail_app_password_here
CLIENT_URL=http://localhost:5173

### client/.env.example
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com

## API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | /api/auth/register | Register | No |
| POST | /api/auth/login | Login | No |
| GET | /api/listings | Browse listings | No |
| POST | /api/listings | Create listing | Owner |
| PATCH | /api/listings/:id/fill | Mark filled | Owner |
| POST | /api/tenant/profile | Create profile | Tenant |
| GET | /api/compatibility/:listingId | Get score | Tenant |
| POST | /api/interest/:listingId | Send interest | Tenant |
| PATCH | /api/interest/:id/respond | Accept/decline | Owner |
| GET | /api/chat/rooms | Get chat rooms | Yes |
| GET | /api/admin/stats | Platform stats | Admin |

## Database Schema

| Collection | Key Fields |
|---|---|
| users | name, email, password, role, isActive |
| listings | owner, title, location, rent, roomType, furnishing, isFilled |
| tenantprofiles | tenant, preferredLocation, budgetMin, budgetMax, moveInDate |
| compatibilityscores | tenant, listing, score, explanation, method |
| interestrequests | tenant, listing, owner, status, compatibilityScore |
| chatrooms | interestRequest, tenant, owner |
| messages | chatRoom, sender, content |

## LLM Prompt

Given this room listing: <listing details> and this tenant profile: <profile details>,
compute a compatibility score from 0 to 100 based on budget and location match.
Return JSON: { "score": number, "explanation": string }

**Example Output:**
```json
{ "score": 88, "explanation": "Location matches. Rent is within budget. Room type matches preference." }
```

If LLM is unavailable, falls back to rule-based scoring:
- Budget match: 40 points
- Location match: 30 points  
- Room type match: 15 points
- Furnishing match: 15 points

## Author
Astha Dixit — B.Tech Computer Science, 4th Year