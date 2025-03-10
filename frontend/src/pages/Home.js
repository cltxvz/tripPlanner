import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Header from "../components/Home/Header";
import Footer from "../components/Footer";

function Home() {
    const navigate = useNavigate();
    const [tripDetails, setTripDetails] = useState({ destination: "", days: "", people: "" });

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripDetails((prev) => ({ ...prev, [name]: value }));
    };

    // Create New Trip
    const handleCreateTrip = (e) => {
        e.preventDefault();
        if (!tripDetails.destination.trim() || tripDetails.days <= 0 || tripDetails.people <= 0) {
            alert("❌ Please fill in all fields correctly.");
            return;
        }
        localStorage.setItem("tripDetails", JSON.stringify(tripDetails));
        navigate("/trip");
    };

    // Handle Trip File Import
    const handleImportTrip = (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("❌ No file selected.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const tripData = JSON.parse(event.target.result);
                if (!tripData.destination || !tripData.days || !tripData.people) {
                    throw new Error("Invalid trip data format.");
                }
                localStorage.setItem("tripDetails", JSON.stringify(tripData));
                navigate("/trip");
            } catch (error) {
                alert("❌ Failed to import trip. Please upload a valid JSON file.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <>
            {/* 🌟 Header */}
            <Header tripDetails={tripDetails} />

            <Container className="mt-5">
                <Row className="justify-content-md-center">
                    <Col md={8}>
                        <Card className="shadow-lg p-4">
                            <Card.Body className="text-center">
                                <h1 className="mb-3">🌍 Ready for takeoff?</h1>
                                <p className="lead">Start by creating a new trip or importing an existing one!</p>

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

            {/* 🔻 Footer with spacing */}
            <div className="mt-5"></div>
            <Footer />
        </>
    );
}

export default Home;
