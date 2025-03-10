import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function ActionButtons({ refreshTripDetails }) {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [trip, setTrip] = useState(() => {
    return JSON.parse(localStorage.getItem("tripDetails")) || { destination: "", days: "1", people: "1" };
  });

  // Validation states
  const [errors, setErrors] = useState({ destination: false, days: false, people: false });

  // ✅ Function to safely trigger trip refresh
  const safeRefreshTripDetails = useCallback(() => {
    setTimeout(() => {
      if (refreshTripDetails) refreshTripDetails();
    }, 0);
  }, [refreshTripDetails]);

  // ✅ Ensure trip data is loaded & avoid undefined values
  useEffect(() => {
    const storedTrip = JSON.parse(localStorage.getItem("tripDetails")) || { destination: "", days: "1", people: "1" };
    setTrip(storedTrip);
  }, []);

  // 🔹 Open Edit Trip Modal and Load Data from LocalStorage
  const handleEditTrip = () => {
    const storedTrip = JSON.parse(localStorage.getItem("tripDetails")) || { destination: "", days: "1", people: "1" };
    setTrip(storedTrip);
    setErrors({ destination: false, days: false, people: false }); // Reset validation on open
    setShowEditModal(true);
  };

  // 🔹 Handle input change and clear validation errors
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrip({ ...trip, [name]: value });

    // Remove error message when user types a valid input
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  // 🔹 Save Edited Trip Details with Inline Validation
  const handleSaveChanges = () => {
    const newErrors = {
      destination: !trip.destination.trim(),
      days: trip.days < 1 || isNaN(trip.days),
      people: trip.people < 1 || isNaN(trip.people),
    };

    setErrors(newErrors);

    // If any validation errors exist, do not proceed
    if (Object.values(newErrors).some((err) => err)) {
      return;
    }

    localStorage.setItem("tripDetails", JSON.stringify(trip));
    setShowEditModal(false);
    safeRefreshTripDetails(); // ✅ Refresh trip details after saving
  };

  // 🔹 Handle Start Over (Show Confirmation Modal)
  const handleStartOver = () => {
    setShowConfirmModal(true);
  };

  // 🔹 Confirm Start Over (Clear LocalStorage)
  const confirmStartOver = () => {
    localStorage.clear(); // 🗑️ Completely clears LocalStorage
    setTrip({ destination: "", days: "1", people: "1" }); // ✅ Reset state immediately
    setShowConfirmModal(false);
    safeRefreshTripDetails(); // ✅ Ensure UI updates immediately
    navigate("/"); // 🚀 Redirect to Home page
  };

  // 🔹 Handle Importing Trip Data
  const handleImportTrip = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setShowConfirmModal(true);
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
      } catch (error) {
        setShowConfirmModal(true);
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
      <Button variant="danger" onClick={handleStartOver} className="m-2">
        🗑️ Start Over
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
          <Form noValidate>
            <Form.Group className="mb-3">
              <Form.Label>Destination</Form.Label>
              <Form.Control
                type="text"
                name="destination"
                minLength="1"
                value={trip.destination}
                onChange={handleChange}
                isInvalid={errors.destination}
                required
              />
              <Form.Control.Feedback type="invalid">
                Destination is required.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Days</Form.Label>
              <Form.Control
                type="number"
                name="days"
                min="1"
                value={trip.days}
                onChange={handleChange}
                isInvalid={errors.days}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid number of days (1 or more).
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Travelers</Form.Label>
              <Form.Control
                type="number"
                name="people"
                min="1"
                value={trip.people}
                onChange={handleChange}
                isInvalid={errors.people}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter at least 1 traveler.
              </Form.Control.Feedback>
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

      {/* ⚠️ Confirmation Modal for Start Over */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>⚠️ Confirm Reset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to start over? This will erase all trip data!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmStartOver}>
            Yes, Start Over
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ActionButtons;
