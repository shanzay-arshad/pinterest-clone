# Pinterest Clone

A full-stack Pinterest-inspired image-sharing application built to practise and understand real-world web development.

Users can create accounts, upload images, explore content shared by other users, save their favourite pins, and manage their own profiles.

This project gave me practical experience building REST APIs, implementing authentication, connecting a frontend to a backend, managing a relational database, handling cloud image storage, and deploying a full-stack application.

## Live Application

- **Frontend:** https://pinterest-clone-shanzay.netlify.app
- **Backend API:** https://pinterest-backend-orpin.vercel.app
- **API Documentation:** https://pinterest-backend-orpin.vercel.app/docs

## Features

- **User Registration:** Create an account using a username, email, and password.
- **User Login:** Authenticate using registered credentials.
- **Secure Authentication:** Password hashing and JWT-based authentication.
- **Explore Feed:** Browse pins uploaded by different users.
- **Upload Pins:** Upload images with titles and descriptions.
- **Save and Unsave Pins:** Add pins to or remove them from a personal saved collection.
- **Saved Pins:** Retrieve saved pins across sessions.
- **User Profiles:** View profile information and uploaded pins.
- **Cloud Image Storage:** Store uploaded images using Cloudinary.
- **Persistent Database:** Store user accounts, pin information, and saved-pin records in PostgreSQL.

## Technologies Used

| Area | Technologies |
|---|---|
| Frontend | HTML, CSS, Bootstrap 5, JavaScript |
| Backend | Python, FastAPI |
| Database | PostgreSQL, Neon |
| ORM | SQLAlchemy |
| Authentication | JWT, Password Hashing |
| Image Storage | Cloudinary |
| API Testing | FastAPI Swagger UI |
| Containerization | Docker, Docker Compose |
| Backend Deployment | Vercel |
| Frontend Deployment | Netlify |
| Version Control | Git, GitHub |

## Application Architecture

The application is divided into frontend, backend, database, and image-storage components.

1. **Frontend – Netlify:** Hosts the user interface built with HTML, CSS, Bootstrap, and JavaScript.
2. **Backend – Vercel:** Hosts the FastAPI application, which handles authentication, API requests, and pin-related operations.
3. **Database – Neon PostgreSQL:** Stores user information, pins, and saved-pin records.
4. **Image Storage – Cloudinary:** Stores uploaded images and provides image URLs that are saved with pin records.

### Architecture Overview

```text
             User / Browser
                    |
                    v
          Netlify - Frontend
                    |
             REST API Requests
                    |
                    v
          Vercel - FastAPI
             /          \
            /            \
           v              v
   Neon PostgreSQL     Cloudinary
   (Application Data)  (Image Storage)
```

## Project Structure

```text
pinterest-clone/
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── Dockerfile
│   └── .dockerignore
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── main.py
│   │   └── create_db.py
│   │
│   ├── uploads/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## API Endpoints

The following are some of the main API endpoints implemented in the project.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/users/register` | Register a new user |
| POST | `/users/login` | Authenticate a user |
| GET | `/users/me` | Retrieve current user information |
| GET | `/users/me/pins` | Retrieve pins uploaded by the current user |
| GET | `/pins/` | Retrieve the Explore feed |
| POST | `/pins/` | Upload a new pin |
| GET | `/saved-pins/me` | Retrieve saved pins |
| POST | `/saved-pins/{pin_id}` | Save a pin |
| DELETE | `/saved-pins/{pin_id}` | Unsave a pin |

For the complete API documentation, visit the [Live Swagger UI](https://pinterest-backend-orpin.vercel.app/docs).

## Running the Project Locally

The project can also be run locally using Docker Compose.

### Requirements

- Git
- Docker Engine
- Docker Compose

### 1. Clone the Repository

```bash
git clone https://github.com/shanzay-arshad/pinterest-clone.git
cd pinterest-clone
```

### 2. Configure Environment Variables

Create your backend environment file from the example:

```bash
cp backend/.env.example backend/.env
```

Configure the required environment variables in `backend/.env`, including your database connection and Cloudinary credentials.

Keep your actual `.env` file private. Never commit passwords, API secrets, or other credentials to GitHub.

### 3. Build and Start the Containers

```bash
docker compose --env-file backend/.env up --build -d
```

### 4. Create Database Tables

```bash
docker compose --env-file backend/.env exec backend python -m app.create_db
```

### 5. Access the Application

| Service | Local URL |
|---|---|
| Frontend | http://localhost:5500 |
| Backend API | http://localhost:8000 |
| Swagger Documentation | http://localhost:8000/docs |

### 6. Stop the Containers

```bash
docker compose --env-file backend/.env down
```

## Deployment

The application is deployed using the following services:

- **Netlify:** Frontend hosting and deployment from GitHub.
- **Vercel:** FastAPI backend hosting.
- **Neon:** Cloud-hosted PostgreSQL database.
- **Cloudinary:** Cloud image storage.

The frontend communicates with the deployed backend through REST API requests. The backend interacts with Neon for application data and Cloudinary for image uploads.

Environment variables are configured separately in the deployment platforms to keep credentials out of the source code.

## What I Learned

Building this project helped me gain practical experience with:

- Developing a frontend using HTML, CSS, Bootstrap, and JavaScript.
- Connecting a frontend to a backend through REST APIs.
- Building backend endpoints using FastAPI.
- Implementing authentication using JWT and password hashing.
- Working with PostgreSQL and SQLAlchemy.
- Handling image uploads and integrating Cloudinary.
- Using Docker and Docker Compose for local development.
- Managing environment variables and application configuration.
- Deploying a frontend and backend separately.
- Connecting cloud-hosted services to build a working full-stack application.
- Using Git and GitHub for version control.

## Future Improvements

Some features I would like to explore and implement in future versions include:

- Like and unlike functionality.
- Boards for organizing saved pins.
- Search and filtering.
- Individual pin detail pages.
- Improved image optimization and pagination.
- Additional security and performance improvements.

## Author

**Shanzay Arshad Malik**

- GitHub: https://github.com/shanzay-arshad
- LinkedIn: https://www.linkedin.com/in/shanzay-arshad-malik-b165932b7/