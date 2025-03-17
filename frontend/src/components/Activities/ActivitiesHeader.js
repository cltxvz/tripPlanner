import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ActivitiesHeader() {
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
      <h1 className="fw-bold">Manage Activities</h1>
      <p className="lead mt-3">
        <strong>🌆 Destination:</strong> {trip.destination || "Unknown"}
        <span className="mx-3">|</span> 
        <strong>📅 Days:</strong> {trip.days || 0}
        <span className="mx-3">|</span> 
        <strong>👥 Travelers:</strong> {trip.people || 0}
      </p>
    </header>
  );
}

export default ActivitiesHeader;
