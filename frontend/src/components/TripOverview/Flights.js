import React, { useState, useEffect, useCallback } from "react";
import { Button, Card, ListGroup, Modal, Form } from "react-bootstrap";

function Flights({ onBudgetUpdate }) {
  const [flights, setFlights] = useState([]);
  const [totalFlightCost, setTotalFlightCost] = useState(0);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [flightData, setFlightData] = useState({ departure: "", arrival: "", cost: "", type: "One-Way" });
  const [errors, setErrors] = useState({ departure: "", arrival: "", cost: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  // Function to Calculate Total Flight Cost
  const calculateTotal = useCallback((updatedFlights) => {
    const total = updatedFlights.reduce((sum, flight) => sum + parseFloat(flight.cost || 0), 0);
    setTotalFlightCost(total.toFixed(2));

    // Save total to localStorage for BudgetAndCosts.js
    localStorage.setItem("totalFlightCost", total.toFixed(2));
  }, []);

  // Load Flights from LocalStorage & calculate total cost
  useEffect(() => {
    const storedFlights = JSON.parse(localStorage.getItem("flights")) || [];
    setFlights(storedFlights);
    calculateTotal(storedFlights);
  }, [calculateTotal]);

  // Validate Inputs
  const validateForm = () => {
    let valid = true;
    let newErrors = { departure: "", arrival: "", cost: "" };

    if (!flightData.departure.trim()) {
      newErrors.departure = "Departure location is required.";
      valid = false;
    }

    if (!flightData.arrival.trim()) {
      newErrors.arrival = "Arrival location is required.";
      valid = false;
    }

    if (flightData.cost === "" || isNaN(flightData.cost)) {
      newErrors.cost = "Cost must be a valid number.";
      valid = false;
    } else if (parseFloat(flightData.cost) < 0) {
      newErrors.cost = "Cost cannot be negative.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle Input Change & Live Validation
  const handleInputChange = (field, value) => {
    setFlightData((prev) => ({ ...prev, [field]: value }));

    // Live validation
    let newErrors = { ...errors };
    if (field === "departure") {
      newErrors.departure = value.trim() ? "" : "Departure location is required.";
    } else if (field === "arrival") {
      newErrors.arrival = value.trim() ? "" : "Arrival location is required.";
    } else if (field === "cost") {
      newErrors.cost =
        value === "" || isNaN(value) ? "Cost must be a valid number." :
        parseFloat(value) < 0 ? "Cost cannot be negative." :
        "";
    }
    setErrors(newErrors);
  };

  // Handle Save (Add/Edit) Flight
  const handleSaveFlight = () => {
    if (!validateForm()) return;

    let updatedFlights = [...flights];

    if (editingIndex !== null) {
      updatedFlights[editingIndex] = { ...flightData, cost: parseFloat(flightData.cost) };
    } else {
      updatedFlights.push({ ...flightData, cost: parseFloat(flightData.cost) });
    }

    localStorage.setItem("flights", JSON.stringify(updatedFlights));
    setFlights(updatedFlights);
    calculateTotal(updatedFlights); // Immediately update budget after save

    // Notify TripOverview SAFELY after re-render
    setTimeout(() => {
      if (onBudgetUpdate) onBudgetUpdate();
    }, 0);

    resetForm();
  };

  // Handle Edit Flight
  const handleEditFlight = (index) => {
    setFlightData(flights[index]);
    setEditingIndex(index);
    setErrors({ departure: "", arrival: "", cost: "" }); // Reset errors
    setShowFlightModal(true);
  };

  // Handle Delete Flight
  const handleDeleteFlight = (index) => {
    let updatedFlights = flights.filter((_, i) => i !== index);
    localStorage.setItem("flights", JSON.stringify(updatedFlights));
    setFlights(updatedFlights);
    calculateTotal(updatedFlights); // Immediately update budget after delete

    // Notify TripOverview after re-render
    setTimeout(() => {
      if (onBudgetUpdate) onBudgetUpdate();
    }, 0);
  };

  // Reset Form Fields
  const resetForm = () => {
    setFlightData({ departure: "", arrival: "", cost: "", type: "One-Way" });
    setEditingIndex(null);
    setErrors({ departure: "", arrival: "", cost: "" }); // Reset validation errors
    setShowFlightModal(false);
  };

  return (
    <>
      {/* Flights Information Card */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="text-center mb-3">✈️ Flights</Card.Title>
          <ListGroup variant="flush">
            {flights.length > 0 ? (
              flights.map((flight, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <span>
                    {flight.departure} ➝ {flight.arrival} ({flight.type}) - ${flight.cost.toFixed(2)}
                  </span>
                  <div>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditFlight(index)}>
                      ✏️ Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteFlight(index)}>
                      🗑️ Delete
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No flights added.</ListGroup.Item>
            )}
          </ListGroup>
          <p className="mt-2"><strong>Total Flight Cost:</strong> ${totalFlightCost}</p>
          <Button variant="info" className="mt-3 w-100" onClick={() => {
            resetForm();
            setShowFlightModal(true);
          }}>
            ➕ Add Flight
          </Button>
        </Card.Body>
      </Card>

      {/* Flight Modal */}
      <Modal show={showFlightModal} onHide={() => setShowFlightModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingIndex !== null ? "Edit Flight" : "Add Flight"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Departure Location</Form.Label>
              <Form.Control
                type="text"
                value={flightData.departure}
                isInvalid={!!errors.departure}
                onChange={(e) => handleInputChange("departure", e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.departure}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Arrival Location</Form.Label>
              <Form.Control
                type="text"
                value={flightData.arrival}
                isInvalid={!!errors.arrival}
                onChange={(e) => handleInputChange("arrival", e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.arrival}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cost ($)</Form.Label>
              <Form.Control
                type="number"
                value={flightData.cost}
                isInvalid={!!errors.cost}
                onChange={(e) => handleInputChange("cost", e.target.value)}
                min="0"
                step="0.01"
              />
              <Form.Control.Feedback type="invalid">
                {errors.cost}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trip Type</Form.Label>
              <Form.Select
                value={flightData.type}
                onChange={(e) => setFlightData({ ...flightData, type: e.target.value })}
              >
                <option value="One-Way">One-Way</option>
                <option value="Roundtrip">Roundtrip</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFlightModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveFlight}>
            {editingIndex !== null ? "Save Changes" : "Add Flight"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Flights;
