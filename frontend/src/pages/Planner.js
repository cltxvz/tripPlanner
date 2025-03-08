import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";

const ITEM_TYPE = "ACTIVITY";

function Planner() {
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [activities, setActivities] = useState([]);
    const [days, setDays] = useState([]);

    // Load trip data from localStorage
    useEffect(() => {
        const storedTrip = localStorage.getItem("tripData");
        if (storedTrip) {
            const tripData = JSON.parse(storedTrip);
            setTrip(tripData);
            setActivities(tripData.activities || []);
            setDays(tripData.days || Array.from({ length: tripData.daysCount || 3 }, () => []));
        } else {
            navigate("/");
        }
    }, [navigate]);

    // Save planner data to localStorage
    const savePlanner = () => {
        if (trip) {
            const updatedTrip = { ...trip, days };
            localStorage.setItem("tripData", JSON.stringify(updatedTrip));
            alert("Planner saved!");
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Container className="mt-5">
                <Row className="justify-content-md-center">
                    <Col md={10}>
                        <h1 className="text-center">Daily Planner</h1>

                        <Row>
                            <Col md={4}>
                                <h4>Available Activities</h4>
                                <ListGroup>
                                    {activities.map((activity, index) => (
                                        <DraggableActivity key={index} activity={activity} index={index} />
                                    ))}
                                </ListGroup>
                            </Col>

                            <Col md={8}>
                                <h4>Plan Your Days</h4>
                                <Row>
                                    {days.map((dayActivities, dayIndex) => (
                                        <DayColumn key={dayIndex} dayIndex={dayIndex} dayActivities={dayActivities} setDays={setDays} />
                                    ))}
                                </Row>
                            </Col>
                        </Row>

                        <div className="text-center mt-4">
                            <Button variant="success" onClick={savePlanner}>
                                💾 Save Plan
                            </Button>
                            <Button variant="secondary" className="ms-3" onClick={() => navigate("/trip")}>
                                🔙 Back to Trip Overview
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </DndProvider>
    );
}

// Component to Drag Activities
function DraggableActivity({ activity, index }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ITEM_TYPE,
        item: { activity, index },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <ListGroup.Item ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} className="mb-2">
            <strong>{activity.title}</strong> - ${activity.cost}
        </ListGroup.Item>
    );
}

// Component for Each Day's Drop Zone
function DayColumn({ dayIndex, dayActivities, setDays }) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ITEM_TYPE,
        drop: (item) => addActivityToDay(item.activity, dayIndex),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const addActivityToDay = (activity, dayIndex) => {
        setDays((prevDays) => {
            const newDays = [...prevDays];
            newDays[dayIndex] = [...newDays[dayIndex], activity];
            return newDays;
        });
    };

    return (
        <Col md={4} ref={drop} className={`border p-3 text-center ${isOver ? "bg-light" : ""}`}>
            <h5>Day {dayIndex + 1}</h5>
            <ListGroup>
                {dayActivities.length === 0 ? <p>No activities</p> : dayActivities.map((act, i) => <ListGroup.Item key={i}>{act.title}</ListGroup.Item>)}
            </ListGroup>
        </Col>
    );
}

export default Planner;
