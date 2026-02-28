# CARD Requisition Full Stack Application

This is a full stack web application to capture property details and generate a formalized, printable CARD Requisition Form. It features a React frontend, Node.js + Express backend, and stores data in a MySQL database.

## Prerequisites
- Node.js (v16+ recommended)
- MySQL Server

## Project Structure
- `/database.sql` - SQL script to set up the MySQL database and table.
- `/server` - Node.js + Express backend.
- `/client` - React + Vite frontend.

---

## 1. Database Setup
1. Open your MySQL client or command line.
2. Execute the commands found inside `database.sql` to create the `card_db` database and `requisitions` table.

---

## 2. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the Database Connection:
   - Open `server/.env` and update the database credentials (e.g., `DB_PASSWORD`) if your local MySQL requires a password.
4. Start the server:
   ```bash
   npm start
   ```
   *The server will run on http://localhost:5000.*

---

## 3. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will typically run on http://localhost:5173.*

---

## Usage
1. Open the frontend URL in your browser.
2. Fill out the **Property Details Form (Form 1)**.
3. Click "Save and Generate Form".
4. The application will save your data to the MySQL database and redirect you to **Form 2**.
5. In Form 2, you can view the exact CARD Requisition Form matching the traditional layout.
6. Use the **Print Form** button to access the native browser print, or the **Download PDF** button to generate a PDF using `jsPDF`.
