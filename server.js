const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const PORT = 3000;
const app = express();

app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database("./events.db", (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create events table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      venue TEXT,
      guestNumber INTEGER,
      type TEXT,
      price INTEGER
    )
  `);
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS booked_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId INTEGER,
      email TEXT NOT NULL,
      FOREIGN KEY (eventId) REFERENCES events(id)
    )
  `);
});

app.post("/events", (req, res) => {
  const eventData = req.body;

  // Check if all required fields are present
  const requiredFields = [
    "name",
    "date",
    "venue",
    "guestNumber",
    "type",
    "price",
  ];
  const missingFields = requiredFields.filter((field) => !eventData[field]);

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields.join(", ")}` });
  }

  const sql = `
    INSERT INTO events (name, date, venue, guestNumber, type, price)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    eventData.name,
    eventData.date,
    eventData.venue,
    eventData.guestNumber,
    eventData.type,
    eventData.price,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Error creating event:", err.message);
      return res.status(500).json({ error: "Failed to create event" });
    }
    console.log(`Event created with id ${this.lastID}`);
    return res.status(201).json({ message: "Event created successfully." });
  });
});

app.post("/book-event/:eventId", (req, res) => {
  const { eventId } = req.params;
  const { email } = req.body;

  // Check if email and eventId are provided
  if (!email || !eventId) {
    return res.status(400).json({ error: "Email is required." });
  }

  // Check if the event with the provided eventId exists
  db.get("SELECT * FROM events WHERE id = ?", [eventId], (err, event) => {
    if (err) {
      console.error("Error checking event:", err.message);
      return res.status(500).json({ error: "Failed to book event." });
    }

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    // Insert booking data into booked_events table
    const sql = `
      INSERT INTO booked_events (eventId, email)
      VALUES (?, ?)
    `;
    const params = [eventId, email];

    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error booking event:", err.message);
        return res.status(500).json({ error: "Failed to book event." });
      }

      console.log(`Event booked with id ${this.lastID}`);
      return res.status(201).json({ message: "Event booked successfully." });
    });
  });
});

// Retrieve events
app.get("/events", (req, res) => {
  const queryParams = req.query;
  const filters = [];

  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key]) {
      filters.push(`${key} = '${queryParams[key]}'`);
    }
  });

  const filterQuery = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const sql = `SELECT * FROM events ${filterQuery}`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error retrieving events:", err.message);
      return res.status(500).json({ error: "Failed to retrieve events." });
    }
    return res.status(200).json({ events: rows });
  });
});

app.get("/venues", (req, res) => {
  const { date, guestNumber } = req.query;

  // Check if date and guestNumber are provided
  if (!date || !guestNumber) {
    return res
      .status(400)
      .json({ error: "Date and guestNumber are required." });
  }

  // Fetch venues from the database based on the provided date and guest number
  const sql = `
    SELECT * FROM events
    WHERE date = ? AND guestNumber >= ?
    ORDER BY price
  `;
  const params = [date, guestNumber];

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("Error retrieving venues:", err.message);
      return res.status(500).json({ error: "Failed to retrieve venues." });
    }

    return res.status(200).json({ venues: rows });
  });
});

app.get("/users", (req, res) => {
  const sql = `
    SELECT booked_events.email AS email, COUNT(*) AS eventCount
    FROM booked_events
    GROUP BY booked_events.email
    ORDER BY eventCount DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error retrieving users:", err.message);
      return res.status(500).json({ error: "Failed to retrieve users." });
    }

    return res.status(200).json({ users: rows });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
