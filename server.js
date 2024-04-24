const express = require("express");
const bodyParser = require("body-parser");

const PORT = 3000;
const app = express();

app.use(bodyParser.json());

let eventsList = [
  {
    name: "Demo event 1",
    date: "2024-04-23",
    venue: "Venue 1",
    guestNumber: 25,
    type: "BirthDay",
    price: 3000,
  },
  {
    name: "Demo event 2",
    date: "2024-04-23",
    venue: "Venue 2",
    guestNumber: 150,
    type: "Wedding",
    price: 10000,
  },
  {
    name: "Demo event 2",
    date: "2024-04-21",
    venue: "Venue 2",
    guestNumber: 150,
    type: "wedding",
    price: 10000,
  },
  {
    name: "Demo event 2",
    date: "2024-04-21",
    venue: "Venue 2",
    guestNumber: 150,
    type: "Wedding",
    price: 10000,
  },
  {
    name: "Demo event 2",
    date: "2024-04-21",
    venue: "Venue 2",
    guestNumber: 150,
    type: "Wedding",
    price: 10000,
  },
];
const eventFields = ["name", "date", "venue", "guestNumber", "type", "price"];

const eventFilters = [
  { name: "type", filter: filterByType },
  { name: "date", filter: filterByDate },
  { name: "name", filter: filterByName },
];
app.post("/events", (req, res) => {
  const eventData = req.body;

  // Validating data in a clean & dynamic way
  let missingFields = [];
  for (let i = 0; i < eventFields.length; i++) {
    const field = eventFields[i];
    if (!eventData[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  eventsList.push(eventData);

  return res
    .status(201)
    .json({ message: "Event created successfully.", event: eventData });
});

app.get("/events", (req, res) => {
  const queryParams = req.query;
  console.log(queryParams);
  let filteredEvents = eventsList;

  // Using loops and objects for clean dynamic code
  eventFilters.forEach((filter) => {
    if (queryParams[filter.name]) {
      filteredEvents = filter.filter(filteredEvents, queryParams[filter.name]);
    }
  });

  if (filteredEvents.length === 0) {
    return res.status(404).json({ error: "No events found." });
  }

  return res.status(200).json({ events: filteredEvents });
});

function filterByType(events, eventType) {
  return events.filter((event) => event.type === eventType);
}
function filterByDate(events, eventDate) {
  return events.filter((event) => event.date === eventDate);
}
function filterByName(events, eventName) {
  const lowerCaseEventName = eventName.toLowerCase();
  return events.filter((event) =>
    event.name.toLowerCase().includes(lowerCaseEventName)
  );
}

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
