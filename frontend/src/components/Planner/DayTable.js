import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function DayTable({ dayPlan, updateDayPlan, onDeleteActivity, onDropActivity }) {
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [editModalShow, setEditModalShow] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);

    const onEditActivity = (activity) => {
        setEditingActivity(activity);
        setEditModalShow(true);
    };

    // Generate time slots in 12-hour format
    const hours = Array.from({ length: 24 }, (_, i) => {
        let period = i < 12 ? "AM" : "PM";
        let hour = i % 12 || 12;
        return `${hour}:00 ${period}`;
    });

    // Convert time string (hh:mm) to total minutes
    const timeToMinutes = (time) => {
        let [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    };

    // Convert minutes to 12-hour format
    const formatTime12H = (time) => {
        let hour = Math.floor(time / 60);
        let minute = time % 60;
        let period = hour < 12 ? "AM" : "PM";
        hour = hour % 12 || 12;
        return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
    };

    // Map activities to row spans
    const activityMap = new Map();
    const columnTracker = new Map();
    const rowSpanTracker = new Map();

    dayPlan.forEach((activity) => {
        const startMinutes = timeToMinutes(activity.startTime);
        const endMinutes = timeToMinutes(activity.endTime);
        const startSlot = Math.floor(startMinutes / 60);
        const endSlot = Math.ceil(endMinutes / 60);
        const rowSpan = endSlot - startSlot;

        let columnIndex = 0;

        for (let i = startSlot; i < endSlot; i++) {
            if (!columnTracker.has(i)) {
                columnTracker.set(i, new Set());
            }
            while (columnTracker.get(i).has(columnIndex)) {
                columnIndex++;
            }
        }

        for (let i = startSlot; i < endSlot; i++) {
            columnTracker.get(i).add(columnIndex);
            if (!activityMap.has(i)) {
                activityMap.set(i, []);
            }

            const row = activityMap.get(i);
            while (row.length <= columnIndex) {
                row.push(null);
            }

            if (i === startSlot) {
                row[columnIndex] = { activity, rowSpan };
                rowSpanTracker.set(activity, rowSpan);
            } else {
                row[columnIndex] = null;
            }
        }
    });

    return (
        <Card className="shadow-sm">
            <Card.Body>
                <Card.Title>🗓 Schedule Activities</Card.Title>
                <Table bordered>
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: "20%" }}>Time</th>
                            <th className="text-center">Activities</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hours.map((hour, index) => {
                            const activities = activityMap.get(index) || [];
                            const columnCount = Math.max(...Array.from(activityMap.values(), (acts) => acts.length), 1);

                            return (
                                <tr key={index} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropActivity(e, hour)}>
                                    <td className="text-center">{hour}</td>

                                    {Array.from({ length: columnCount }, (_, colIndex) => {
                                        const activityEntry = activities[colIndex];

                                        if (activityEntry === null) return null;

                                        const { activity, rowSpan } = activityEntry || {};

                                        return activity ? (
                                            <td
                                                key={colIndex}
                                                rowSpan={rowSpan}
                                                className="text-center align-middle p-2"
                                                style={{
                                                    minWidth: "150px",
                                                    backgroundColor: activity.color,
                                                    color: "white",
                                                    border: "1px solid #dee2e6"
                                                }}
                                                onClick={() => setSelectedActivity(selectedActivity === activity ? null : activity)}
                                            >
                                                <strong>{activity.title}</strong>
                                                <br />
                                                💰 Cost Per Person: ${activity.cost.toFixed(2)}
                                                <br />
                                                ({formatTime12H(timeToMinutes(activity.startTime))} - 
                                                {formatTime12H(timeToMinutes(activity.endTime))})

                                                {/* ✅ Centered action buttons */}
                                                {selectedActivity === activity && (
                                                    <div className="mt-2 d-flex justify-content-center">
                                                        <Button
                                                            variant="warning"
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onEditActivity(activity);
                                                            }}
                                                        >
                                                            ✏️ Edit
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDeleteActivity(dayPlan.indexOf(activity));
                                                                setSelectedActivity(null);
                                                            }}
                                                        >
                                                            🗑️ Remove
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        ) : <td key={colIndex}></td>;
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Card.Body>

            {/* 🔹 Edit Modal */}
            <Modal show={editModalShow} onHide={() => setEditModalShow(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Activity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingActivity && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={editingActivity.startTime}
                                    onChange={(e) => setEditingActivity({ ...editingActivity, startTime: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>End Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={editingActivity.endTime}
                                    onChange={(e) => setEditingActivity({ ...editingActivity, endTime: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Block Color</Form.Label>
                                <Form.Control
                                    type="color"
                                    value={editingActivity.color}
                                    onChange={(e) => setEditingActivity({ ...editingActivity, color: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditModalShow(false)}>Cancel</Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (typeof updateDayPlan === "function") {
                                updateDayPlan(dayPlan.map(act => act.id === editingActivity.id ? editingActivity : act));
                                setEditModalShow(false);
                            } else {
                                console.error("❌ updateDayPlan is not a function. Ensure it is passed as a prop.");
                            }
                        }}
                        
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}

export default DayTable;
