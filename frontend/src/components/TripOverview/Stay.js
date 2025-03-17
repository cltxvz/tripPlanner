import React, { useState, useEffect, useCallback } from "react";
import { Button, Card, ListGroup, Modal, Form } from "react-bootstrap";

function Stay({ onBudgetUpdate }) {
  const [stays, setStays] = useState([]);
  const [totalStayCost, setTotalStayCost] = useState(0);
  const [showStayModal, setShowStayModal] = useState(false);
  const [stayData, setStayData] = useState({ name: "", location: "", nights: "", cost: "" });
  const [errors, setErrors] = useState({ name: "", location: "", nights: "", cost: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  // Function to Calculate Total Stay Cost
  const calculateTotal = useCallback((updatedStays) => {
    const total = updatedStays.reduce((sum, stay) => sum + parseFloat(stay.cost || 0), 0);
    setTotalStayCost(total.toFixed(2));

    // Save total to localStorage for BudgetAndCosts.js
    localStorage.setItem("totalStayCost", total.toFixed(2));
  }, []);

  // Load Stays from LocalStorage & calculate total cost
  useEffect(() => {
    const storedStays = JSON.parse(localStorage.getItem("stays")) || [];
    setStays(storedStays);
    calculateTotal(storedStays);
  }, [calculateTotal]); // Update budget

  // Validate Inputs
  const validateForm = () => {
    let valid = true;
    let newErrors = { name: "", location: "", nights: "", cost: "" };

    if (!stayData.name.trim()) {
      newErrors.name = "Stay name is required.";
      valid = false;
    }

    if (!stayData.location.trim()) {
      newErrors.location = "Location is required.";
      valid = false;
    }

    if (stayData.nights === "" || isNaN(stayData.nights) || parseInt(stayData.nights) <= 0) {
      newErrors.nights = "Number of nights must be a positive number.";
      valid = false;
    }

    if (stayData.cost === "" || isNaN(stayData.cost) || parseFloat(stayData.cost) < 0) {
      newErrors.cost = "Cost must be a valid number and cannot be negative.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle Input Change & Live Validation
  const handleInputChange = (field, value) => {
    setStayData((prev) => ({ ...prev, [field]: value }));

    // Live validation
    let newErrors = { ...errors };
    if (field === "name") {
      newErrors.name = value.trim() ? "" : "Stay name is required.";
    } else if (field === "location") {
      newErrors.location = value.trim() ? "" : "Location is required.";
    } else if (field === "nights") {
      newErrors.nights = value === "" || isNaN(value) || parseInt(value) <= 0
        ? "Number of nights must be a positive number."
        : "";
    } else if (field === "cost") {
      newErrors.cost =
        value === "" || isNaN(value) ? "Cost must be a valid number." :
        parseFloat(value) < 0 ? "Cost cannot be negative." :
        "";
    }
    setErrors(newErrors);
  };

  // Handle Save (Add/Edit) Stay
  const handleSaveStay = () => {
    if (!validateForm()) return;

    let updatedStays = [...stays];

    if (editingIndex !== null) {
      updatedStays[editingIndex] = { ...stayData, cost: parseFloat(stayData.cost) };
    } else {
      updatedStays.push({ ...stayData, cost: parseFloat(stayData.cost) });
    }

    localStorage.setItem("stays", JSON.stringify(updatedStays));
    setStays(updatedStays);
    calculateTotal(updatedStays); // Immediately update budget after save

    // Notify TripOverview after re-render
    setTimeout(() => {
      if (onBudgetUpdate) onBudgetUpdate();
    }, 0);

    resetForm();
  };

  // Handle Edit Stay
  const handleEditStay = (index) => {
    setStayData(stays[index]);
    setEditingIndex(index);
    setErrors({ name: "", location: "", nights: "", cost: "" }); // Reset errors
    setShowStayModal(true);
  };

  // Handle Delete Stay
  const handleDeleteStay = (index) => {
    let updatedStays = stays.filter((_, i) => i !== index);
    localStorage.setItem("stays", JSON.stringify(updatedStays));
    setStays(updatedStays);
    calculateTotal(updatedStays); // Immediately update budget after delete

    // Notify TripOverview SAFELY after re-render
    setTimeout(() => {
      if (onBudgetUpdate) onBudgetUpdate();
    }, 0);
  };

  // Reset Form Fields
  const resetForm = () => {
    setStayData({ name: "", location: "", nights: "", cost: "" });
    setEditingIndex(null);
    setErrors({ name: "", location: "", nights: "", cost: "" }); // Reset validation errors
    setShowStayModal(false);
  };

  return (
    <>
      {/* Stay Information Card */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="text-center mb-3">🏨 Stay</Card.Title>
          <ListGroup variant="flush">
            {stays.length > 0 ? (
              stays.map((stay, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <span>
                    {stay.name} ({stay.location}) - {stay.nights} nights - ${stay.cost.toFixed(2)}
                  </span>
                  <div>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditStay(index)}>
                      ✏️ Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteStay(index)}>
                      🗑️ Delete
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No stays added.</ListGroup.Item>
            )}
          </ListGroup>
          <p className="mt-2"><strong>Total Stay Cost:</strong> ${totalStayCost}</p>
          <Button variant="info" className="mt-3 w-100" onClick={() => {
            resetForm();
            setShowStayModal(true);
          }}>
            ➕ Add Stay
          </Button>
        </Card.Body>
      </Card>

      {/* Stay Modal */}
      <Modal show={showStayModal} onHide={() => setShowStayModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingIndex !== null ? "Edit Stay" : "Add Stay"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Stay Name</Form.Label>
              <Form.Control
                type="text"
                value={stayData.name}
                isInvalid={!!errors.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={stayData.location}
                isInvalid={!!errors.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
              <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Nights</Form.Label>
              <Form.Control
                type="number"
                value={stayData.nights}
                isInvalid={!!errors.nights}
                onChange={(e) => handleInputChange("nights", e.target.value)}
                min="1"
              />
              <Form.Control.Feedback type="invalid">{errors.nights}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cost ($)</Form.Label>
              <Form.Control
                type="number"
                value={stayData.cost}
                isInvalid={!!errors.cost}
                onChange={(e) => handleInputChange("cost", e.target.value)}
                min="0"
                step="0.01"
              />
              <Form.Control.Feedback type="invalid">{errors.cost}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStayModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveStay}>
            {editingIndex !== null ? "Save Changes" : "Add Stay"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Stay;
