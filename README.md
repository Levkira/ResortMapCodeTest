# Resort Map & Cabana Booking System

This application provides an interactive resort map where guests can view real-time cabana availability and secure their reservation with a seamless, integrated booking flow.

I opted for a Node.js/Express backend and a React frontend.

---

## 📡 API Endpoints

| Method | Endpoint                  | Description                                                  |
| ------ | ------------------------- | ------------------------------------------------------------ |
| GET    | `/api`                    | Serves the raw or parsed `map.ascii` layout.                 |
| GET    | `/api/bookings`           | Serves the guest list and room numbers from `bookings.json`. |
| GET    | `/api/bookings/booked`    | Returns a list of cabanas that are currently occupied.       |
| POST   | `/api/bookings/:cabanaId` | Validates guest info and books the specific cabana.          |

---

## Frontend: Context-Aware Tile Rendering

**Design Decision:**
The frontend implements context-aware rendering. It parses the ASCII art into a grid where each character is replaced by a specific image tile. To create a correct visual representation of path, the choice of tile image depends on its neighbors.

**Trade-off:**
This adds logic complexity to the frontend rendering engine, but it fulfils the goal of a visually-rich resort map.

---

## Booking Flow & Validation

**Selection:**
Click any cabana with a green overlay on the map.

**Validation:**
The system requires a **Guest Name** and **Room Number**.

The backend checks these against the guest list retrieved from `/api/bookings`.

**Real-Time Update:**
Once the POST request is successful, the cabana status is updated in memory.

**Visual Feedback:**
The frontend immediately re-syncs with `/api/bookings/booked`. The map will then render that cabana with a red overlay to prevent further booking attempts.

---

## Getting Started

### Prerequisites

* Node.js (v16 or higher)
* npm or yarn

---

## Installation

1. Clone the repository

2. Install Backend and Frontend Dependencies

---

## 🛠 Running the Application

```bash
npm run dev
```

---

## Running Tests

From the server directory:  npx vitest api.test.js
From the **server directory**:

```bash
npx vitest api.test.js
```

From the **client directory**:

```bash
npm run test:run
```
