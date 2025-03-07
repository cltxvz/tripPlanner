const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Import Trip (Frontend sends a JSON file)
app.post("/import", (req, res) => {
    const tripData = req.body;
    res.json({ success: true, trip: tripData });
});

// Export Trip (Frontend requests a JSON file)
app.post("/export", (req, res) => {
    const tripData = JSON.stringify(req.body, null, 2);
    res.setHeader("Content-Disposition", "attachment; filename=trip.json");
    res.setHeader("Content-Type", "application/json");
    res.send(tripData);
});

app.get("/", (req, res) => {
    res.send("TripPlanner Backend is Running!");
});

// Start the server
const PORT = 5003;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
