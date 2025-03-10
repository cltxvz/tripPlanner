import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function ActionButtons({ refreshTripDetails }) {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [trip, setTrip] = useState({ destination: "", days: 1, people: 1 });

  // 🟢 Load trip details when the component mounts
  useEffect(() => {
    const storedTrip = JSON.parse(localStorage.getItem("tripDetails")) || { destination: "", days: 1, people: 1 };
    setTrip(storedTrip);
  }, []);

  // ✅ Function to safely trigger trip refresh
  const safeRefreshTripDetails = useCallback(() => {
    setTimeout(() => {
      if (refreshTripDetails) refreshTripDetails();
    }, 0);
  }, [refreshTripDetails]);

  // 🔹 Open Edit Trip Modal and Load Data from LocalStorage
  const handleEditTrip = () => {
    const storedTrip = JSON.parse(localStorage.getItem("tripDetails")) || { destination: "", days: 1, people: 1 };
    setTrip(storedTrip);
    setShowEditModal(true);
  };

  // 🔹 Save Edited Trip Details
  const handleSaveChanges = () => {
    if (!trip.destination.trim() || trip.days < 1 || trip.people < 1) {
      alert("❌ Please enter valid trip details.");
      return;
    }

    localStorage.setItem("tripDetails", JSON.stringify(trip));
    setShowEditModal(false);
    safeRefreshTripDetails(); // ✅ Refresh trip details after saving
  };

  // 🔹 Handle Importing Trip Data
  const handleImportTrip = (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert("❌ No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTrip = JSON.parse(e.target.result);

        if (!importedTrip.destination || !importedTrip.days || !importedTrip.people) {
          throw new Error("Invalid trip data format.");
        }

        localStorage.setItem("tripDetails", JSON.stringify(importedTrip));
        setTrip(importedTrip); // ✅ Immediately update state
        safeRefreshTripDetails(); // ✅ Ensure header & days update
        alert("✅ Trip imported successfully!");
      } catch (error) {
        alert("❌ Failed to import trip. Please upload a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // 🔹 Handle Exporting Trip Data
  const handleExportTrip = () => {
    const tripData = localStorage.getItem("tripDetails") || "{}";
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(tripData);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "trip-plan.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  return (
    <div className="text-center mt-4">
      {/* 🚀 Action Buttons */}
      <Button variant="secondary" onClick={() => navigate("/")} className="m-2">
        🏠 Start Over
      </Button>
      <Button variant="warning" onClick={handleEditTrip} className="m-2">
        ✏️ Edit Trip
      </Button>
      <Button variant="info" onClick={() => navigate("/activities")} className="m-2">
        📋 Manage Activities
      </Button>
      <label htmlFor="import-trip-input" className="btn btn-primary m-2">
        📥 Import Trip
      </label>
      <input type="file" id="import-trip-input" onChange={handleImportTrip} style={{ display: "none" }} />
      <Button variant="success" onClick={handleExportTrip} className="m-2">
        📤 Export Trip
      </Button>

      {/* 📝 Edit Trip Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Trip Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Destination</Form.Label>
              <Form.Control
                type="text"
                value={trip.destination}
                onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Number of Days</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={trip.days}
                onChange={(e) => setTrip({ ...trip, days: Number(e.target.value) })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Number of Travelers</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={trip.people}
                onChange={(e) => setTrip({ ...trip, people: Number(e.target.value) })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ActionButtons;
