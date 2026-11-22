# Pinterest Clone

I built this project as a way to practise full-stack web development and understand how a real-world image-sharing application works.

The idea was to create a platform inspired by Pinterest where users can create accounts, upload images, explore pins uploaded by other users, save pins they like, and view their own profiles.

While working on this project, I got hands-on experience with frontend development, REST APIs, authentication, database management, and Docker.

## Features

Here are the features I have implemented so far:

- **User Registration:** Users can create an account using a username, email, and password.
- **User Login:** Registered users can log in securely.
- **Authentication:** Passwords are hashed, and JWT tokens are used for authentication.
- **Explore Feed:** Users can browse pins uploaded by different users.
- **Upload Pins:** Logged-in users can upload images with a title and description.
- **Save and Unsave Pins:** Users can save pins they like and remove them from their saved collection.
- **Saved Pins:** Saved pins remain available after refreshing the page or logging out and logging back in.
- **User Profiles:** Users can view their profile information and the pins they have uploaded.
- **Image Storage:** Uploaded images are stored locally and managed through a Docker volume.

## Technologies Used

| Area | Technologies |
|---|---|
| Frontend | HTML, CSS, Bootstrap 5, JavaScript |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Authentication | JWT, Password Hashing |
| API Testing | FastAPI Swagger UI |
| Containerization | Docker, Docker Compose |
| Version Control | Git and GitHub |

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

## How the Application Works

I divided the application into three main parts:

1. **Frontend:** This is where users interact with the application. It handles the interface, forms, navigation, and displaying pins.
2. **Backend:** FastAPI handles requests from the frontend, user authentication, image uploads, and pin-related operations.
3. **Database:** PostgreSQL stores user information, pin details, and saved-pin records.

SQLAlchemy is used to communicate with the PostgreSQL database.

## Running the Project with Docker

I used Docker Compose to run the frontend, backend, and database together instead of setting up and running each service separately.

### Requirements

- Docker Engine
- Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/shanzay-arshad/pinterest-clone.git
cd pinterest-clone
```

### 2. Configure environment variables

Create your backend environment file using the example:

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and configure the required database credentials and application settings.

Keep this file private. It should never be uploaded to GitHub.

### 3. Build and start the containers

```bash
docker compose --env-file backend/.env up --build -d
```

This builds the images and starts the three services.

### 4. Create the database tables

Run this command the first time you set up the project:

```bash
docker compose --env-file backend/.env exec backend python -m app.create_db
```

### 5. Open the application

- Frontend: http://localhost:5500
- Backend API: http://localhost:8000
- Swagger API Documentation: http://localhost:8000/docs

### 6. Stop the application

```bash
docker compose --env-file backend/.env down
```

Docker volumes are used to preserve database records and uploaded images when containers are removed and recreated. Avoid using `docker compose down -v` if you want to keep this data.

## API Endpoints

Some of the main API endpoints implemented in the project are:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/users/register` | Register a new user |
| POST | `/users/login` | Log in |
| GET | `/users/me` | Get current user information |
| GET | `/users/me/pins` | Get pins uploaded by the current user |
| GET | `/pins/` | Retrieve the Explore feed |
| POST | `/pins/` | Upload a new pin |
| GET | `/saved-pins/me` | Retrieve saved pins |
| POST | `/saved-pins/{pin_id}` | Save a pin |
| DELETE | `/saved-pins/{pin_id}` | Unsave a pin |

## What I Learned

Working on this project helped me understand how different parts of a full-stack application connect with each other.

Some of the things I learned and practised include:

- Connecting a frontend with a FastAPI backend.
- Creating and testing REST APIs.
- Working with PostgreSQL and SQLAlchemy.
- Implementing user authentication using JWT.
- Handling image uploads and storing files.
- Managing application services using Docker Compose.
- Using Docker volumes to preserve application data.
- Managing project changes using Git and GitHub.

## Future Improvements

There are still some features I would like to explore and add:

- Like and unlike functionality.
- Boards for organizing saved pins.
- Search and filtering.
- Individual pin detail pages.
- Integration with Amazon S3 for image storage.
- Improved deployment and scaling.

This project is still a learning experience, and I plan to keep improving it as I learn more about full-stack development.