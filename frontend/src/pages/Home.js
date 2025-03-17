import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Header from "../components/Home/Header";
import Footer from "../components/Footer";

function Home() {
    const navigate = useNavigate();
    const [tripDetails, setTripDetails] = useState({ destination: "", days: "", people: "" });
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertVariant, setAlertVariant] = useState("danger");

    // Show an Alert with auto-hide
    const showAlert = (message, variant = "danger") => {
        setAlertMessage(message);
        setAlertVariant(variant);

        // Auto-hide after 3 seconds
        setTimeout(() => setAlertMessage(null), 3000);
    };

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripDetails((prev) => ({ ...prev, [name]: value }));
    };

    // Create New Trip
    const handleCreateTrip = (e) => {
        e.preventDefault();
        localStorage.clear(); // Clears any previous trip

        if (!tripDetails.destination.trim() || tripDetails.days <= 0 || tripDetails.people <= 0) {
            showAlert("❌ Please fill in all fields correctly.", "danger");
            return;
        }

        localStorage.setItem("tripDetails", JSON.stringify(tripDetails));
        navigate("/trip");
    };

    // Handle Trip File Import
    const handleImportTrip = (event) => {
        const file = event.target.files[0];

        if (!file) {
            showAlert("❌ No file selected.", "danger");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);

                // Ensure imported data contains the necessary fields
                if (!importedData.tripDetails || !importedData.tripDetails.destination || !importedData.tripDetails.days || !importedData.tripDetails.people) {
                    throw new Error("Invalid trip data format.");
                }

                // Clear existing data before importing
                localStorage.clear();

                // Load all imported data into LocalStorage
                Object.keys(importedData).forEach((key) => {
                    localStorage.setItem(key, JSON.stringify(importedData[key]));
                });

                showAlert("✅ Trip imported successfully!", "success");
                setTimeout(() => navigate("/trip"), 1500); // Redirect after success
            } catch (error) {
                showAlert("❌ Failed to import trip. Please upload a valid JSON file.", "danger");
            }
        };

        reader.readAsText(file);
    };

    return (
        <>
            {/* Header */}
            <Header tripDetails={tripDetails} />

            <Container className="mt-5">
                <Row className="justify-content-md-center">
                    <Col md={8}>
                        <Card className="shadow-lg p-4">
                            <Card.Body className="text-center">
                                <h1 className="mb-3">🌍 Ready for takeoff?</h1>
                                <p className="lead">Start by creating a new trip or importing an existing one!</p>

                                {/* Styled Alert Message */}
                                {alertMessage && (
                                    <Alert variant={alertVariant} className="text-center">
                                        {alertMessage}
                                    </Alert>
                                )}

                                {/* Create Trip Form */}
                                <Form onSubmit={handleCreateTrip} className="mb-4">
                                    <Form.Group className="mb-3 text-start">
                                        <Form.Label>🌆 Destination</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="destination"
                                            value={tripDetails.destination}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3 text-start">
                                        <Form.Label>📅 Number of Days</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="days"
                                            min="1"
                                            value={tripDetails.days}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3 text-start">
                                        <Form.Label>👥 Number of Travelers</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="people"
                                            min="1"
                                            value={tripDetails.people}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Button variant="success" type="submit" className="mt-3 w-100">
                                        📝 Start Planning
                                    </Button>
                                </Form>

                                {/* Import Trip */}
                                <div className="mt-3">
                                    <label className="btn btn-primary w-100">
                                        📥 Import Trip
                                        <input type="file" accept="application/json" onChange={handleImportTrip} style={{ display: "none" }} />
                                    </label>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <div className="mt-5"></div>
            <Footer />
        </>
    );
}

export default Home;
