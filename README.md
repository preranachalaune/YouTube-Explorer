
# YouTube Explorer

A responsive YouTube video search application built with React, Node.js, Express, and RapidAPI.

YouTube Explorer allows users to search for YouTube videos, view video details, and explore additional search results through cursor-based pagination.

## Features

- Search YouTube videos using keywords
- Display video thumbnails
- Display video titles and channel names
- Show video duration and view count
- Load more videos using cursor-based pagination
- Loading indicators
- Error handling
- Empty search result handling
- Responsive user interface
- Clear search functionality

## Technologies Used

### Frontend

- React
- JavaScript
- CSS
- Vite

### Backend

- Node.js
- Express.js
- RapidAPI
- YouTube Data API

## Project Structure

```text
YouTube-Explorer/
├── server/
│   ├── server.js
│   └── package.json
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/preranachalaune/YouTube-Explorer.git
cd YouTube-Explorer
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` folder. Add your RapidAPI credentials using the variable names expected by `server.js`.

Never upload your `.env` file or API key to GitHub.

### 4. Install Backend Dependencies

Open a separate terminal and run:

```bash
cd server
npm install
```

### 5. Start the Backend Server

From the `server` folder, run:

```bash
node server.js
```

The backend server should run at `http://localhost:5000`.

### 6. Start the Frontend

Open another terminal in the project root folder and run:

```bash
npm run dev
```

Open the local URL shown in your terminal, usually `http://localhost:5173`.

## Security

- Keep your RapidAPI key private.
- Store API credentials in the server's `.env` file.
- Ensure `.env` is included in `.gitignore`.
- Never commit secret credentials to GitHub.

## Author

Created as a YouTube video search project using React and Node.js.
