import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";

function Activities() {
    const [trip, setTrip] = useState(null);
    const [activities, setActivities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentActivity, setCurrentActivity] = useState({ title: "", description: "", cost: 0 });
    const [editingIndex, setEditingIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTrip = localStorage.getItem("tripData");
        if (storedTrip) {
            const tripData = JSON.parse(storedTrip);
            setTrip(tripData);
            setActivities(tripData.activities || []);
        } else {
            navigate("/");
        }
    }, [navigate]);

    const handleShowModal = (index = null) => {
        if (index !== null) {
            setCurrentActivity(activities[index]);
            setEditingIndex(index);
        } else {
            setCurrentActivity({ title: "", description: "", cost: 0 });
            setEditingIndex(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveActivity = () => {
        if (!currentActivity.title.trim()) return;
        let updatedActivities = [...activities];

        if (editingIndex !== null) {
            updatedActivities[editingIndex] = currentActivity;
        } else {
            updatedActivities.push(currentActivity);
        }

        setActivities(updatedActivities);
        updateTripData(updatedActivities);
        handleCloseModal();
    };

    const handleDeleteActivity = (index) => {
        const updatedActivities = activities.filter((_, i) => i !== index);
        setActivities(updatedActivities);
        updateTripData(updatedActivities);
    };

    const updateTripData = (updatedActivities) => {
        const updatedTrip = { ...trip, activities: updatedActivities };
        setTrip(updatedTrip);
        localStorage.setItem("tripData", JSON.stringify(updatedTrip));
    };

    return (
        <Container className="mt-5">
            {trip ? (
                <>
                    <Row className="justify-content-md-center">
                        <Col md={8} className="text-center">
                            <h1>Manage Activities</h1>
                            <p><strong>Trip Name:</strong> {trip.name}</p>

                            <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
                                ➕ Add New Activity
                            </Button>

                            <ListGroup>
                                {activities.map((activity, index) => (
                                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{activity.title}</strong> - ${activity.cost} <br />
                                            <small>{activity.description}</small>
                                        </div>
                                        <div>
                                            <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(index)}>✏️ Edit</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteActivity(index)}>🗑️ Delete</Button>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>

                            <Button variant="secondary" className="mt-3" onClick={() => navigate("/trip")}>
                                🔙 Back to Trip Overview
                            </Button>
                        </Col>
                    </Row>

                    {/* Modal for Adding/Editing Activities */}
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>{editingIndex !== null ? "Edit Activity" : "Add Activity"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Activity Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentActivity.title}
                                        onChange={(e) => setCurrentActivity({ ...currentActivity, title: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentActivity.description}
                                        onChange={(e) => setCurrentActivity({ ...currentActivity, description: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cost per Person ($)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={currentActivity.cost}
                                        min="0"
                                        onChange={(e) => setCurrentActivity({ ...currentActivity, cost: parseFloat(e.target.value) || 0 })}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                            <Button variant="success" onClick={handleSaveActivity}>Save</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : (
                <p>Loading trip data...</p>
            )}
        </Container>
    );
}

export default Activities;
