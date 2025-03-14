import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Card, ListGroup, Container, Row, Col } from "react-bootstrap";
import ActivitiesHeader from "../components/Activities/ActivitiesHeader";
import Footer from "../components/Footer";

function Activities() {
  const navigate = useNavigate();
  const [tripDetails, setTripDetails] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityData, setActivityData] = useState({ title: "", description: "", cost: "" });
  const [errors, setErrors] = useState({ title: "", cost: "" });

  // Ensure a trip exists; otherwise, navigate back to home page
  useEffect(() => {
    const storedTrip = JSON.parse(localStorage.getItem("tripDetails"));
    if (!storedTrip || !storedTrip.destination) {
      navigate("/");
    } else {
      setTripDetails(storedTrip);
    }

    const storedActivities = JSON.parse(localStorage.getItem("activities")) || [];
    setActivities(storedActivities);
  }, [navigate]);

  // Function to refresh trip details everywhere
  const refreshTripDetails = useCallback(() => {
    const updatedTrip = JSON.parse(localStorage.getItem("tripDetails")) || {};
    setTripDetails(updatedTrip);
  }, []);

  // Handle Input Change & Live Validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivityData((prev) => ({ ...prev, [name]: value }));

    // Live validation
    let newErrors = { ...errors };
    if (name === "title") {
      newErrors.title = value.trim() ? "" : "Title is required.";
    } else if (name === "description") {
      newErrors.description = value.trim() ? "" : "Description is required.";
    } else if (name === "cost") {
      newErrors.cost =
        value === "" || isNaN(value) ? "Cost must be a valid number." :
        parseFloat(value) < 0 ? "Cost cannot be negative." :
        "";
    }
    setErrors(newErrors);
  };

  // Validate Activity Form
  const validateForm = () => {
    let valid = true;
    let newErrors = { title: "", cost: "" };

    if (!activityData.title.trim()) {
      newErrors.title = "Title is required.";
      valid = false;
    }

    if (!activityData.description.trim()) {
      newErrors.description = "Description is required.";
      valid = false;
    }

    if (activityData.cost === "" || isNaN(activityData.cost)) {
      newErrors.cost = "Cost must be a valid number.";
      valid = false;
    } else if (parseFloat(activityData.cost) < 0) {
      newErrors.cost = "Cost cannot be negative.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle Opening Modal for Add/Edit
  const handleOpenModal = (activity = null) => {
    if (activity) {
      setEditingActivity(activity.id);
      setActivityData(activity);
    } else {
      setEditingActivity(null);
      setActivityData({ title: "", description: "", cost: "" });
    }
    setErrors({ title: "", description: "", cost: "" }); // 🔹 Reset errors
    setShowModal(true);
  };

  // Handle Save Activity with Global Updates
  const handleSaveActivity = () => {
    if (!validateForm()) return;

    let updatedActivities = [...activities];

    if (editingActivity) {
      // Edit existing activity and update everywhere
      updatedActivities = updatedActivities.map((act) =>
        act.id === editingActivity ? { ...act, ...activityData, cost: parseFloat(activityData.cost) } : act
      );

      // Update `tripDetails.dayPlans` where the activity exists
      let updatedTrip = JSON.parse(localStorage.getItem("tripDetails")) || { dayPlans: {} };
      if (updatedTrip.dayPlans) {
        Object.keys(updatedTrip.dayPlans).forEach((day) => {
          let dayPlan = updatedTrip.dayPlans[day];
          if (dayPlan.dayPlan) {
            dayPlan.dayPlan = dayPlan.dayPlan.map((act) =>
              act.id === editingActivity ? { ...act, title: activityData.title, description: activityData.description, cost: parseFloat(activityData.cost) } : act
            );
          }
        });

        localStorage.setItem("tripDetails", JSON.stringify(updatedTrip));
      }
    } else {
      // Add new activity
      updatedActivities.push({ id: Date.now(), ...activityData, cost: parseFloat(activityData.cost) });
    }

    setActivities(updatedActivities);
    localStorage.setItem("activities", JSON.stringify(updatedActivities));
    setShowModal(false);
    refreshTripDetails();
  };

  // Handle Delete Activity
  const handleDeleteActivity = (id) => {
    const updatedActivities = activities.filter((act) => act.id !== id);
    setActivities(updatedActivities);
    localStorage.setItem("activities", JSON.stringify(updatedActivities));

    // Remove from tripDetails.dayPlans as well
    let updatedTrip = JSON.parse(localStorage.getItem("tripDetails")) || { dayPlans: {} };
    if (updatedTrip.dayPlans) {
      Object.keys(updatedTrip.dayPlans).forEach((day) => {
        let dayPlan = updatedTrip.dayPlans[day];
        if (dayPlan.dayPlan) {
          dayPlan.dayPlan = dayPlan.dayPlan.filter((act) => act.id !== id);
        }
      });

      localStorage.setItem("tripDetails", JSON.stringify(updatedTrip));
    }

    refreshTripDetails();
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <ActivitiesHeader tripDetails={tripDetails} />

      <Container className="mt-5 mb-5 flex-grow-1">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-lg p-4">
              <Card.Body>
                <h2 className="mb-3 text-center">📋 Activity Pool</h2>
                <p className="lead text-center">Manage your activities for the trip.</p>

                {/* Buttons */}
                <div className="d-flex justify-content-between mb-4">
                  <Button variant="secondary" onClick={() => navigate("/trip")}>
                    🔙 Trip Overview
                  </Button>
                  <Button variant="primary" onClick={() => handleOpenModal()}>
                    ➕ Add Activity
                  </Button>
                </div>

                {/* Activity List */}
                <ListGroup className="mt-3">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <ListGroup.Item key={activity.id} className="d-flex justify-content-between align-items-center">
                        <div className="text-start">
                          <strong>{activity.title}</strong>
                          {activity.description && <p className="mb-1">{activity.description}</p>}
                          <span className="text-muted">💰 Cost Per Person: ${parseFloat(activity.cost).toFixed(2)}</span>
                        </div>
                        <div>
                          <Button variant="outline-primary" size="sm" onClick={() => handleOpenModal(activity)}>
                            ✏️ Edit
                          </Button>{" "}
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteActivity(activity.id)}>
                            🗑️ Delete
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item className="text-center">No activities added yet.</ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Activity Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingActivity ? "Edit Activity" : "Add Activity"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Activity Title</Form.Label>
              <Form.Control type="text" name="title" value={activityData.title} isInvalid={!!errors.title} onChange={handleChange} />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" name="description" value={activityData.description} isInvalid={!!errors.description} onChange={handleChange} />
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost Per Person ($)</Form.Label>
              <Form.Control type="number" name="cost" min ="0" step="0.01" value={activityData.cost} isInvalid={!!errors.cost} onChange={handleChange} />
              <Form.Control.Feedback type="invalid">{errors.cost}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveActivity}>{editingActivity ? "Save Changes" : "Add Activity"}</Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}

export default Activities;
