import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Extras() {
    return (
        <Row className="mt-4">
            {/* 💸 Additional Expenses */}
            <Col md={4}>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title>💸 Additional Expenses</Card.Title>
                        <ListGroup variant="flush" id="additional-expenses-list">
                            {/* Expenses dynamically populated here */}
                        </ListGroup>
                        <p className="mt-2"><strong>Total Additional Expenses:</strong> $<span id="additional-expenses-total">0.00</span></p>
                        <Button variant="outline-danger">Add Expense</Button>
                    </Card.Body>
                </Card>
            </Col>

            {/* 💰 Budget & Costs */}
            <Col md={4}>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title>💰 Budget & Costs</Card.Title>
                        <ListGroup variant="flush">
                            <ListGroup.Item><strong>Total Cost (All Travelers):</strong> $<span id="total-cost-all-travelers">0.00</span></ListGroup.Item>
                            <ListGroup.Item><strong>Total Budget (All Travelers):</strong> $<span id="total-budget-all-travelers">0.00</span></ListGroup.Item>
                            <ListGroup.Item><strong>Total Cost (Per Person):</strong> $<span id="total-cost-per-person">0.00</span></ListGroup.Item>
                            <ListGroup.Item><strong>Total Budget (Per Person):</strong> $<span id="total-budget">0.00</span></ListGroup.Item>
                        </ListGroup>
                        <Button variant="outline-warning" className="mt-2">✏️ Edit Budget</Button>
                    </Card.Body>
                </Card>
            </Col>

            {/* ✅ To-Do List */}
            <Col md={4}>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title>✅ To-Do List</Card.Title>
                        <ListGroup variant="flush" id="todo-list">
                            {/* To-Do items dynamically populated here */}
                        </ListGroup>
                        <Button variant="outline-info" className="mt-2">Add To-Do</Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default Extras;
