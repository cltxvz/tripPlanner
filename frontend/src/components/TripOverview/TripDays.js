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
    const [tripDetails, setTripDetails] = useState(() => {
        return JSON.parse(localStorage.getItem("tripDetails")) || { days: 1, people: 1, dayPlans: {} };
    });

    const [days, setDays] = useState([]);

    // ✅ Load trip days when `tripDetails` updates
    useEffect(() => {
        if (tripDetails.days) {
            setDays(new Array(Number(tripDetails.days)).fill(null));
        }
    }, [tripDetails.days]);

    // ✅ Recalculate total cost for each day when `tripDetails` changes
    useEffect(() => {
        updateDayPlanCosts();
    }, [tripDetails.people]); // ✅ Trigger when number of travelers changes

    // ✅ Ensure trip details stay synced with localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            const updatedTrip = JSON.parse(localStorage.getItem("tripDetails")) || { days: 1, people: 1, dayPlans: {} };
            setTripDetails(updatedTrip);
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // ✅ Recalculate and update trip day costs when the number of travelers changes
    const updateDayPlanCosts = () => {
        const storedTrip = JSON.parse(localStorage.getItem("tripDetails")) || { days: 1, people: 1, dayPlans: {} };
        const updatedTrip = { ...storedTrip };

        if (updatedTrip.dayPlans) {
            Object.keys(updatedTrip.dayPlans).forEach((day) => {
                let dayPlan = updatedTrip.dayPlans[day];

                if (dayPlan.dayPlan) {
                    const totalCostPerPerson = dayPlan.dayPlan.reduce((sum, activity) => sum + parseFloat(activity.cost || 0), 0);
                    dayPlan.totalCost = totalCostPerPerson * (updatedTrip.people || 1); // ✅ Update cost for all travelers
                }
            });
        }

        localStorage.setItem("tripDetails", JSON.stringify(updatedTrip));
        setTripDetails(updatedTrip);
    };

    // ✅ Navigate to planner for selected day
    const goToDay = (dayNumber) => {
        localStorage.setItem("selectedDay", dayNumber);
        navigate("/planner");
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>📅 Trip Days</Card.Title>
                            <div className="d-flex flex-wrap justify-content-center">
                                {days.length > 0 ? (
                                    days.map((_, index) => (
                                        <Card key={index} className="m-2 shadow-sm" style={{ width: "18rem" }}>
                                            <Card.Body>
                                                <Card.Title>Day {index + 1}</Card.Title>
                                                <ListGroup variant="flush">
                                                    {tripDetails.dayPlans &&
                                                    tripDetails.dayPlans[index + 1] &&
                                                    tripDetails.dayPlans[index + 1].dayPlan ? (
                                                        <>
                                                            {tripDetails.dayPlans[index + 1].dayPlan.map((activity, i) => (
                                                                <ListGroup.Item key={i}>
                                                                    {activity.title} - $
                                                                    {Number(activity.cost || 0).toFixed(2)} {/* ✅ Fix NaN error */}
                                                                </ListGroup.Item>
                                                            ))}
                                                            <ListGroup.Item className="text-muted">
                                                                <strong>Total Cost for All Travelers:</strong> $
                                                                {Number(tripDetails.dayPlans[index + 1].totalCost || 0).toFixed(2)}
                                                            </ListGroup.Item>
                                                        </>
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
