import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function DaySchedule({ dayPlan, updateDayPlan, updateAvailableActivities }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // 🔹 Handle Drag Over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 🔹 Handle Drop (Open Modal)
  const handleDrop = (e) => {
    e.preventDefault();

    const activityData = e.dataTransfer.getData("activity");
    if (!activityData) return;

    const activity = JSON.parse(activityData);
    setSelectedActivity(activity);
    setShowModal(true); // ✅ Open modal on drop
  };

  // 🔹 Handle Activity Save
  const handleSaveActivity = () => {
    if (!startTime || !endTime || endTime <= startTime) {
      alert("❌ Please enter valid start and end times.");
      return;
    }

    const newActivity = {
      ...selectedActivity,
      startTime,
      endTime,
      cost: Number(selectedActivity.cost) || 0, // ✅ Ensure cost is a valid number
    };

    updateDayPlan([...dayPlan, newActivity]); // ✅ Update state & save
    setShowModal(false);
    setStartTime("");
    setEndTime("");
  };

  // 🔹 Handle Deleting Activity (Move Back to Available Activities)
  const handleDeleteActivity = (index) => {
    const removedActivity = dayPlan[index];

    // ✅ Remove from day schedule
    const updatedDayPlan = dayPlan.filter((_, i) => i !== index);
    updateDayPlan(updatedDayPlan);

    // ✅ Move activity back to available activities (only if function exists)
    if (typeof updateAvailableActivities === "function") {
      updateAvailableActivities((prev) => [...prev, removedActivity]);
    }
  };

  return (
    <>
      {/* 🗓 Day Schedule Section */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>🗓 Day Schedule</Card.Title>
          <div
            className="drop-zone p-4 border rounded text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{ minHeight: "200px", backgroundColor: "#f8f9fa" }}
          >
            {dayPlan.length === 0 ? (
              <p className="text-muted">Drag activities here to plan your day</p>
            ) : (
              dayPlan.map((activity, index) => (
                <div key={index} className="border p-2 mb-2 bg-light d-flex justify-content-between align-items-center">
                  <span>
                    <strong>{activity.title}</strong> ({activity.startTime} - {activity.endTime})
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteActivity(index)}
                  >
                    🗑️ Remove
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card.Body>
      </Card>

      {/* 🔹 Activity Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Set Activity Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedActivity && (
            <>
              <p>
                <strong>Activity:</strong> {selectedActivity.title}
              </p>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveActivity}>
            Add to Schedule
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DaySchedule;
