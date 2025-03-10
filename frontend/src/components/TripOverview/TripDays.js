import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function TripDays() {
    const navigate = useNavigate();
    const [tripDetails, setTripDetails] = useState(null);
    const [days, setDays] = useState([]);

    useEffect(() => {
        // Load trip details from localStorage
        const storedTrip = JSON.parse(localStorage.getItem("tripDetails"));
        if (storedTrip) {
            setTripDetails(storedTrip);
            setDays(new Array(storedTrip.days).fill(null));
        }
    }, []);

    // Function to navigate to the selected day's plan
    const goToDay = (dayNumber) => {
        localStorage.setItem("selectedDay", dayNumber);
        navigate("/day-planner");
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>📅 Trip Days</Card.Title>
                            <div className="d-flex flex-wrap justify-content-center">
                                {tripDetails ? (
                                    days.length > 0 ? (
                                        days.map((_, index) => (
                                            <Card key={index} className="m-2 shadow-sm" style={{ width: "18rem" }}>
                                                <Card.Body>
                                                    <Card.Title>Day {index + 1}</Card.Title>
                                                    <ListGroup variant="flush">
                                                        {tripDetails.dayPlans &&
                                                        tripDetails.dayPlans[index + 1] &&
                                                        tripDetails.dayPlans[index + 1].dayPlan ? (
                                                            tripDetails.dayPlans[index + 1].dayPlan.map((activity, i) => (
                                                                <ListGroup.Item key={i}>
                                                                    {activity.title} - ${activity.cost.toFixed(2)}
                                                                </ListGroup.Item>
                                                            ))
                                                        ) : (
                                                            <ListGroup.Item>No activities planned</ListGroup.Item>
                                                        )}
                                                    </ListGroup>
                                                    <Button
                                                        variant="primary"
                                                        className="mt-2"
                                                        onClick={() => goToDay(index + 1)}
                                                    >
                                                        📝 Plan/Edit Day
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        ))
                                    ) : (
                                        <p>No trip days available.</p>
                                    )
                                ) : (
                                    <p>Loading trip details...</p>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default TripDays;
