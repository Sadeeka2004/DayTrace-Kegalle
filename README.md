# DayTrace Kegalle

### Discover Hidden Gems, Plan Your Perfect Day Journey

DayTrace Kegalle is a web-based local tourism information and one-day visit planning system designed to help visitors discover, explore, and plan journeys to attractions within the Kegalle region.

The system provides organized information about natural, cultural, historical, religious, and recreational destinations. Visitors can search and filter attractions, view detailed information, explore locations using an interactive map, and create a simple personalized one-day visit plan.

The project was developed as an individual academic project for the **ITE2953 Programming Group Project** at the **University of Moratuwa**.

---

## 📌 Project Overview

Visitors often have difficulty discovering lesser-known local attractions and finding the essential information needed to organize a one-day visit.

**DayTrace Kegalle** addresses this problem by bringing local attraction information into a single web application.

The system focuses on attractions located within a **25 km radius of Wilpola, Aranayake, Kegalle District, Sri Lanka**.

The application is designed around two main user classes:

* **Tourist / User**
* **Administrator**

The system focuses on information discovery and day-visit planning. It does **not** provide online booking, payment processing, transport reservations, or real-time navigation.

---

## ✨ Features

### 👤 Tourist / User Features

* Browse local tourist attractions
* Search attractions by name, category, or location
* Filter attractions by category
* View detailed destination information
* View opening times, facilities, travel information, and travel tips
* View multiple attraction images using a responsive gallery
* Mark and filter favourite attractions in the current browser
* View attraction locations using Leaflet and OpenStreetMap
* Open attraction information from interactive map markers
* Preview an approximate driving route between selected locations
* View approximate route distance and estimated travel time
* Add multiple attractions to a one-day visit plan
* Reorder and remove attractions from the current day plan
* Clear and review the complete one-day visit plan

### 🔐 Administrator Features

* Secure administrator authentication
* Protected administrator routes and operations
* Add new tourist attractions
* Edit existing attraction information
* Delete attractions with confirmation
* Upload and manage multiple attraction images
* Select a primary attraction image
* Prevent duplicate image selection
* Search and filter attraction records
* View attraction, category, map, and image statistics
* Upload, link, change, or restore the website logo

---

## 🗺️ Project Area

The application focuses on attractions within approximately **25 km of Wilpola, Aranayake, Kegalle District**.

Some of the attractions included in the project are:

1. Bathalegala (Bible Rock)
2. Ambuluwawa Biodiversity Complex
3. Meeyan Ella Waterfall
4. Saradiyel Village
5. Pinnawala Zoo
6. Sandaraja Wana Arana
7. The Cloud Resort
8. Millennium Elephant Foundation
9. Niloluwa Ancient Bridge
10. Dewanagala Rajamaha Viharaya

The final application may contain additional attractions as the project develops.

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* React Leaflet
* Leaflet
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token (JWT)
* bcryptjs
* Multer

### Database

* MongoDB Atlas
* Mongoose ODM

### Maps and Route Preview

* Leaflet
* React Leaflet
* OpenStreetMap
* OSRM public routing service

### Development Tools

* Visual Studio Code
* Git
* GitHub
* npm

---

## 🏗️ System Architecture

The project follows a client-server architecture.

```text
┌──────────────────────────────┐
│        Tourist / Admin       │
│          Web Browser         │
└──────────────┬───────────────┘
               │
               │ HTTP / REST API
               ▼
┌──────────────────────────────┐
│       React Frontend         │
│      Vite + Tailwind CSS     │
└──────────────┬───────────────┘
               │
               │ REST API Requests
               ▼
┌──────────────────────────────┐
│       Node.js Backend        │
│          Express.js          │
├──────────────────────────────┤
│ Controllers                  │
│ Routes                       │
│ Middleware                   │
│ Authentication               │
│ File Upload Handling         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       MongoDB Atlas          │
│          Database            │
└──────────────────────────────┘

               +
               
┌──────────────────────────────┐
│   Leaflet + OpenStreetMap    │
│      Interactive Maps        │
└──────────────────────────────┘
```

---

## 📁 Project Structure

```text
DayTrace-Kegalle/
│
├── daytrace-backend/
│   ├── config/
│   │   ├── database.js
│   │   └── environment.js
│   │
│   ├── controllers/
│   │   ├── attractionController.js
│   │   ├── authController.js
│   │   ├── brandingController.js
│   │   └── uploadController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── logoUploadMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Attraction.js
│   │   └── Branding.js
│   │
│   ├── routes/
│   │   ├── attractionRoutes.js
│   │   ├── authRoutes.js
│   │   ├── brandingRoutes.js
│   │   └── uploadRoutes.js
│   │
│   ├── scripts/
│   │   └── createAdmin.js
│   │
│   ├── uploads/
│   │   └── attractions/
│   │
│   ├── utils/
│   │   ├── brandingStorage.js
│   │   ├── geography.js
│   │   └── imageStorage.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── daytrace-frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Prerequisites

Before running the project, install:

* Node.js
* npm
* MongoDB Atlas account
* Git

Recommended development environment:

* Windows
* Visual Studio Code
* Modern web browser such as Chrome, Edge, or Firefox

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/Sadeeka2004/DayTrace-Kegalle.git
```

Move into the project directory:

```bash
cd DayTrace-Kegalle
```

---

## 2. Backend Setup

Move into the backend directory:

```bash
cd daytrace-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`.

### Backend environment variables

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password
```

**Important:** Never commit the `.env` file to GitHub.

The `.env.example` file is provided as a template.

---

## 3. Start the Backend

For development:

```bash
npm run dev
```

Or start normally with:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

---

## 4. Frontend Setup

Open another terminal and move to the frontend directory:

```bash
cd daytrace-frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`.

```env
VITE_API_URL=http://localhost:5000/api
VITE_OSRM_BASE_URL=https://router.project-osrm.org
```
`VITE_OSRM_BASE_URL` configures the routing service used for approximate route previews. The public OSRM demonstration service is used during development.

---

## 5. Start the Frontend

Run:

```bash
npm run dev
```

Vite will provide a local development URL, normally:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

---

# 🗄️ Database

DayTrace Kegalle uses **MongoDB Atlas** as its database.

MongoDB is accessed from the backend through **Mongoose**.

The application uses database models for the main system entities, including:

* Attractions
* Administrators
* Branding information

The final database schema may evolve during implementation and system refinement.

---

# 🔐 Security

Sensitive configuration is stored using environment variables.

The following files must **not** be committed to GitHub:

```text
.env
```

The repository contains `.env.example` files that demonstrate the required environment variable structure without exposing credentials.

Authentication uses JWT-based authentication, while administrator passwords are handled using password hashing.

---

# 🗺️ Maps, Locations, and Route Preview

The project uses **Leaflet** and **OpenStreetMap** to display attraction locations on an interactive map.

Users can:

* View available attraction markers
* Search and select mapped attractions
* Open attraction details from map markers
* Select a starting location and destination
* Display an approximate driving route
* View estimated route distance and travel time
* Clear the currently displayed route

Approximate routes are requested from the OSRM public routing service. DayTrace Kegalle does not provide live traffic information, automatic route optimization, turn-by-turn navigation, or transport booking.

OpenStreetMap attribution remains visible on the map.

---

# 📋 Project Scope

### Included

* Local tourism information
* Attraction discovery
* Search
* Category filtering
* Attraction details
* Location information
* Interactive map
* One-day visit planning
* Administrator authentication
* Attraction management
* Attraction image management
* Multiple attraction image management
* Browser-based favourites
* Approximate route preview
* Website branding management
* Responsive public and administrator interfaces

### Not Included

The following are outside the current project scope:

* Online booking
* Online payment processing
* Transport reservations
* Real-time navigation
* Full travel route optimization
* Online accommodation booking

---

# 🎓 Academic Context

**Project:** DayTrace Kegalle

**Module:** ITE2953 Programming Group Project

**Institution:** University of Moratuwa

**Project Type:** Individual Web Application Project

The project follows the requirements defined in the project's Software Requirements Specification (SRS).

The system was developed through requirements analysis, stakeholder consultation, system design, implementation, testing, and iterative refinement.

---

# 📈 Project Status

The main implementation of DayTrace Kegalle is complete.

The completed system includes attraction discovery, search and filtering, attraction details, multiple image galleries, favourites, interactive maps, approximate route previews, one-day visit planning, administrator authentication, attraction management, image management, and website branding management.

The project satisfies the core requirements defined in the Final Software Requirements Specification while including selected UI/UX and usability enhancements that do not change the original project scope.

Final testing, data verification, documentation, and deployment preparation may continue before academic submission.

---

# 🔮 Future Enhancements

Possible future improvements include:

* Additional verified local attractions
* Improved attraction information
* Further UI/UX refinements
* Improved travel-plan experience
* Additional filtering options
* Enhanced accessibility
* More comprehensive testing
* Deployment of the application
* Additional performance and usability improvements

Future enhancements will be evaluated against the project's academic requirements and SRS scope.

---

# 📌 Development Notes

The project is organized into separate frontend and backend applications.

```text
Frontend → REST API → Backend → MongoDB Atlas
```

The frontend communicates with the backend through REST API endpoints.

The backend handles:

* Business logic
* Authentication
* Database operations
* Attraction management
* Image uploads
* Branding-related operations

The frontend handles:

* User interface
* Navigation
* Attraction discovery
* Filtering and searching
* Maps
* Day planning
* Administrator interfaces

---

# 👨‍💻 Author

**Pathima Sadeeka**

Bachelor of Information Technology (BIT)
University of Moratuwa

---

## 📄 License

No open-source license has been specified for this academic project.

---

## ⭐ Project

**DayTrace Kegalle — Discover Hidden Gems, Plan Your Perfect Day Journey**
