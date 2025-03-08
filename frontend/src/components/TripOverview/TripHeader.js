import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function TripHeader({ destination, days, travelers }) {
  return (
    <header className="text-center py-4 bg-primary text-white shadow">
      <h1 className="fw-bold">TripPlanner</h1>
      {destination && (
        <p className="mt-2 lead">
          🌍 <strong>{destination}</strong> | 📅 {days} days | 👥 {travelers} travelers
        </p>
      )}
    </header>
  );
}

export default TripHeader;
