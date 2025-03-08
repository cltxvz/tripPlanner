import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Home() {
    const navigate = useNavigate();
    const [tripDetails, setTripDetails] = useState({ destination: "", days: "", people: "" });
    const [suggestions, setSuggestions] = useState([]);

    // Fetch OpenCage API Key from .env
    const API_KEY = process.env.REACT_APP_OPENCAGE_API_KEY;
    const API_URL = "https://api.opencagedata.com/geocode/v1/json";

    // Fetch Location Suggestions (Debounced)
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (tripDetails.destination.length < 3) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await axios.get(`${API_URL}?q=${encodeURIComponent(tripDetails.destination)}&key=${API_KEY}&limit=5`);
                setSuggestions(response.data.results.map((res) => res.formatted));
            } catch (error) {
                console.error("Error fetching location suggestions:", error);
            }
        };

        const debounceFetch = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceFetch);
    }, [tripDetails.destination, API_KEY]);  // ✅ Added API_KEY here

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripDetails((prev) => ({ ...prev, [name]: value }));
    };

    // Select Suggested Destination
    const selectSuggestion = (place) => {
        setTripDetails((prev) => ({ ...prev, destination: place }));
        setSuggestions([]);
    };

    // Create New Trip
    const handleCreateTrip = (e) => {
        e.preventDefault();
        if (!tripDetails.destination || tripDetails.days <= 0 || tripDetails.people <= 0) {
            alert("Please fill in all fields correctly.");
            return;
        }
        localStorage.setItem("tripDetails", JSON.stringify(tripDetails));
        navigate("/trip");
    };

    // Handle Trip File Import
    const handleImportTrip = (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("No file selected.");
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
                alert("Failed to import trip. Please upload a valid JSON file.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6} className="text-center">
                    <h1>Trip Planner</h1>
                    <p>Your personal vacation itinerary assistant.</p>

                    {/* Create Trip Form */}
                    <Form onSubmit={handleCreateTrip} className="mb-3">
                        <Form.Group>
                            <Form.Label>Destination:</Form.Label>
                            <Form.Control
                                type="text"
                                name="destination"
                                value={tripDetails.destination}
                                onChange={handleChange}
                                placeholder="Start typing a location..."
                                autoComplete="off"
                                required
                            />
                            {suggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {suggestions.map((place, index) => (
                                        <li key={index} onClick={() => selectSuggestion(place)}>
                                            {place}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Number of Days:</Form.Label>
                            <Form.Control type="number" name="days" min="1" value={tripDetails.days} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Number of Travelers:</Form.Label>
                            <Form.Control type="number" name="people" min="1" value={tripDetails.people} onChange={handleChange} required />
                        </Form.Group>

                        <Button variant="success" type="submit" className="mt-3">
                            📝 Start Planning
                        </Button>
                    </Form>

                    {/* Import Trip */}
                    <Form.Group className="mt-3">
                        <Form.Label>Or Import a Trip File:</Form.Label>
                        <Form.Control type="file" accept="application/json" onChange={handleImportTrip} />
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;
