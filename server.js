const express = require("express");
const bodyParser = require("body-parser");

const PORT = 3000;
const app = express();

app.use(bodyParser.json());

let eventsList = [];
const eventFields = ["name", "date", "venue", "guestNumber", "type"];

const eventFilters = [
  { name: "type", filterFunction: filterByType },
  { name: "date", filterFunction: filterByDate },
];
app.post("/events", (req, res) => {
  const eventData = req.body;

  //validating data in a clean & dynamic way
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

  // add the event to the list
  eventsList.push(eventData);

  return res
    .status(201)
    .json({ message: "Event created successfully.", event: eventData });
});

app.get("/events", (req, res) => {
  const queryParams = req.query;
  let filteredEvents = events;

  // using a loops and structs for clean dynamic code
  eventFilters.forEach((filter) => {
    if (queryParams[filter.name]) {
      filteredEvents = filter.filterFunction(
        filteredEvents,
        queryParams[filter.name]
      );
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

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
