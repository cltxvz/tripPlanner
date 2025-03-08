import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function TripDays() {
    return (
        <Row className="mt-4">
            <Col md={12}>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title>📅 Trip Days</Card.Title>
                        <div id="days-grid" className="d-flex flex-wrap justify-content-center">
                            {/* Days dynamically loaded here */}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default TripDays;
