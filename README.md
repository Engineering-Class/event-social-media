# Software Engineering Project

This is a full-stack project built for creating and managing events with user authentication and friend management functionalities. The project includes a responsive calendar interface, event feed, and user profile editing capabilities.

## Features

- **User Authentication**:
  - Register, login, and reset password.
  - Email verification.

- **Event Management**:
  - Create, view, and delete events.
  - View events in a responsive calendar.

- **Friend Management**:
  - Send, accept, and decline friend requests.
  - Manage friends list.

- **User Profile**:
  - Edit username, email, and password.

- **Responsive Design**:
  - Calendar adjusts dynamically to handle multiple events per day.

---

## Tech Stack

### Frontend
- **React**: For building the user interface.
- **Material-UI**: For responsive and modern UI components.

### Backend
- **Node.js**: Runtime environment.
- **Express.js**: For building RESTful APIs.
- **Mongoose**: For interacting with MongoDB.

### Database
- **MongoDB**: NoSQL database for storing user data, events, and friendships.

---

## Setup Instructions

### Prerequisites
- **Node.js** and **npm** installed.
- **MongoDB** installed and running locally or a MongoDB Atlas connection string.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Engineering-Class/event-social-media.git
   cd event-social-media
   ```

2. Install dependencies:
   ```bash
   npm install
   cd frontend
   npm install
   cd ..
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_HOST=smtp.your-email-provider.com
   EMAIL_PORT=your-email-port
   EMAIL_USER=your-email-address
   EMAIL_PASS=your-email-password
   CLIENT_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

5. Start the frontend development server:
   ```bash
   cd client
   npm start
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Project Structure

```
root
├── client                  # React frontend
│   ├── public              # Static assets
│   ├── src
│   │   ├── api             # Axios instance setup
│   │   ├── components      # Reusable components (Navbar, Sidebar, etc.)
│   │   ├── contexts        # Context API for authentication
│   │   ├── pages           # React pages (Dashboard, Calendar, etc.)
│   │   ├── theme           # Custom Material-UI theme
│   │   └── App.tsx         # Entry point for React app
├── src                     # Backend
│   ├── controllers         # Business logic for routes
│   ├── middleware          # Middleware (auth, etc.)
│   ├── models              # Mongoose models (User, Event, etc.)
│   ├── routes              # Express routes
│   ├── utils               # Helper functions (email, logging, etc.)
│   └── server.ts           # Entry point for the backend
├── .env                    # Environment variables
├── package.json            # Backend dependencies
└── README.md               # Project documentation
```

---

## Scripts

### Backend
- `npm start`: Start the backend server.

### Frontend
- `npm start`: Start the React development server (from the `client` folder).

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

## License
This project is licensed under the [MIT License](LICENSE).

---
