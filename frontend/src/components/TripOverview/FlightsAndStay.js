import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function FlightsAndStay() {
    return (
        <Row className="mt-4">
            {/* ✈️ Flights Section */}
            <Col md={6}>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title>✈️ Flights Information</Card.Title>
                        <ListGroup variant="flush">
                            <ListGroup.Item id="flights-list">
                                {/* Flights dynamically loaded here */}
                            </ListGroup.Item>
                        </ListGroup>
                        <p className="mt-2"><strong>Total Flights Cost:</strong> $<span id="flights-total-cost">0.00</span></p>
                        <Button variant="outline-primary">Add Flight Info</Button>
                    </Card.Body>
                </Card>
            </Col>

            {/* 🏨 Stay Section */}
            <Col md={6}>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title>🏨 Stay Information</Card.Title>
                        <ListGroup variant="flush">
                            <ListGroup.Item id="stay-list">
                                {/* Stays dynamically loaded here */}
                            </ListGroup.Item>
                        </ListGroup>
                        <p className="mt-2"><strong>Total Stay Cost:</strong> $<span id="stay-total-cost">0.00</span></p>
                        <Button variant="outline-primary">Add Stay Info</Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default FlightsAndStay;
