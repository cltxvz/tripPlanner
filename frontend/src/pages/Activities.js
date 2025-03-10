import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ActivitiesHeader from "../components/Activities/ActivitiesHeader"; // ✅ Use new header
import Footer from "../components/Footer";

function Activities() {
  const navigate = useNavigate();
  const [tripDetails, setTripDetails] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityData, setActivityData] = useState({ title: "", description: "", cost: "" });

  // ✅ Ensure a trip exists; otherwise, navigate back to home page
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

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivityData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle Opening Modal for Add/Edit
  const handleOpenModal = (activity = null) => {
    if (activity) {
      setEditingActivity(activity.id);
      setActivityData(activity);
    } else {
      setEditingActivity(null);
      setActivityData({ title: "", description: "", cost: "" });
    }
    setShowModal(true);
  };

  // 🔹 Handle Save Activity
  const handleSaveActivity = () => {
    if (!activityData.title.trim() || isNaN(activityData.cost) || activityData.cost < 0) {
      alert("❌ Please enter a valid title and cost.");
      return;
    }

    let updatedActivities = [...activities];

    if (editingActivity) {
      // Edit existing activity
      updatedActivities = updatedActivities.map((act) =>
        act.id === editingActivity ? { ...act, ...activityData } : act
      );
    } else {
      // Add new activity
      updatedActivities.push({ id: Date.now(), ...activityData });
    }

    setActivities(updatedActivities);
    localStorage.setItem("activities", JSON.stringify(updatedActivities));
    setShowModal(false);
  };

  // 🔹 Handle Delete Activity
  const handleDeleteActivity = (id) => {
    const updatedActivities = activities.filter((act) => act.id !== id);
    setActivities(updatedActivities);
    localStorage.setItem("activities", JSON.stringify(updatedActivities));
  };

  return (
    <div className="d-flex flex-column min-vh-100"> {/* ✅ Ensure full-height layout */}
      <ActivitiesHeader tripDetails={tripDetails} />

      <Container className="mt-5 mb-5 flex-grow-1"> {/* ✅ Ensures content pushes footer down */}
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
                        <div className="text-start"> {/* ✅ Left-aligned text */}
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

      {/* 🔹 Activity Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingActivity ? "Edit Activity" : "Add Activity"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Activity Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={activityData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={activityData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost Per Person ($)</Form.Label>
              <Form.Control
                type="number"
                name="cost"
                min="0"
                step="0.01"
                value={activityData.cost}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveActivity}>
            {editingActivity ? "Save Changes" : "Add Activity"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}

export default Activities;
