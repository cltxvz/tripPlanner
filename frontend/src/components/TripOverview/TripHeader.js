import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function TripHeader() {
  const [trip, setTrip] = useState({ destination: "", days: 0, people: 0 });

  // Load trip details from localStorage
  useEffect(() => {
    const storedTrip = JSON.parse(localStorage.getItem("tripDetails"));
    if (storedTrip) {
      setTrip(storedTrip);
    }
  }, []);

  return (
    <header className="text-center py-4 bg-primary text-white shadow">
      <h1 className="fw-bold">TripPlanner</h1>
      <p className="lead mt-2">
        <strong>Destination:</strong> {trip.destination || "Unknown"} |
        <strong> Days:</strong> {trip.days || 0} |
        <strong> Travelers:</strong> {trip.people || 0}
      </p>
    </header>
  );
}

export default TripHeader;
