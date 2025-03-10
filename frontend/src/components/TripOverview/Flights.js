import React, { useState, useEffect, useCallback } from "react";
import { Button, Card, ListGroup, Modal, Form } from "react-bootstrap";

function Flights({ onBudgetUpdate }) {
  const [flights, setFlights] = useState([]);
  const [totalFlightCost, setTotalFlightCost] = useState(0);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [flightData, setFlightData] = useState({ departure: "", arrival: "", cost: "", type: "One-Way" });
  const [editingIndex, setEditingIndex] = useState(null);

  // 🔹 Function to Calculate Total Flight Cost
  const calculateTotal = useCallback((updatedFlights) => {
    const total = updatedFlights.reduce((sum, flight) => sum + parseFloat(flight.cost || 0), 0);
    setTotalFlightCost(total.toFixed(2));

    // ✅ Save total to localStorage for BudgetAndCosts.js
    localStorage.setItem("totalFlightCost", total.toFixed(2));
  }, []);

  // 🟢 Load Flights from LocalStorage & calculate total cost
  useEffect(() => {
    const storedFlights = JSON.parse(localStorage.getItem("flights")) || [];
    setFlights(storedFlights);
    calculateTotal(storedFlights);
  }, [calculateTotal]); // ✅ Fix: Now safely updates budget

  // 🔹 Handle Save (Add/Edit) Flight
  const handleSaveFlight = () => {
    if (!flightData.departure || !flightData.arrival || isNaN(flightData.cost) || parseFloat(flightData.cost) < 0) {
      alert("❌ Please enter valid flight details.");
      return;
    }

    let updatedFlights = [...flights];

    if (editingIndex !== null) {
      updatedFlights[editingIndex] = { ...flightData, cost: parseFloat(flightData.cost) };
    } else {
      updatedFlights.push({ ...flightData, cost: parseFloat(flightData.cost) });
    }

    localStorage.setItem("flights", JSON.stringify(updatedFlights));
    setFlights(updatedFlights);
    calculateTotal(updatedFlights); // ✅ Immediately update budget after save

    // ✅ Notify TripOverview SAFELY after re-render
    setTimeout(() => {
      if (onBudgetUpdate) onBudgetUpdate();
    }, 0);

    resetForm();
  };

  // 🔹 Handle Edit Flight
  const handleEditFlight = (index) => {
    setFlightData(flights[index]);
    setEditingIndex(index);
    setShowFlightModal(true);
  };

  // 🔹 Handle Delete Flight
  const handleDeleteFlight = (index) => {
    let updatedFlights = flights.filter((_, i) => i !== index);
    localStorage.setItem("flights", JSON.stringify(updatedFlights));
    setFlights(updatedFlights);
    calculateTotal(updatedFlights); // ✅ Immediately update budget after delete

    // ✅ Notify TripOverview SAFELY after re-render
    setTimeout(() => {
      if (onBudgetUpdate) onBudgetUpdate();
    }, 0);
  };

  // 🔹 Reset Form Fields
  const resetForm = () => {
    setFlightData({ departure: "", arrival: "", cost: "", type: "One-Way" });
    setEditingIndex(null);
    setShowFlightModal(false);
  };

  return (
    <>
      {/* ✈️ Flights Information Card */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>✈️ Flights</Card.Title>
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
          <Button variant="outline-primary" onClick={() => setShowFlightModal(true)}>
            ➕ Add Flight
          </Button>
        </Card.Body>
      </Card>

      {/* 🔹 Flight Modal */}
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
                onChange={(e) => setFlightData({ ...flightData, departure: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Arrival Location</Form.Label>
              <Form.Control
                type="text"
                value={flightData.arrival}
                onChange={(e) => setFlightData({ ...flightData, arrival: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost ($)</Form.Label>
              <Form.Control
                type="number"
                value={flightData.cost}
                onChange={(e) => setFlightData({ ...flightData, cost: e.target.value })}
                min="0"
                step="0.01"
              />
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
          <Button variant="secondary" onClick={() => setShowFlightModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveFlight}>
            {editingIndex !== null ? "Save Changes" : "Add Flight"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Flights;
