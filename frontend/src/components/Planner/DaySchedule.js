import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import DayTable from "./DayTable"; // ✅ Using the new table component

function DaySchedule({ dayPlan, updateDayPlan, updateAvailableActivities }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState("#007bff"); // Default color (Bootstrap primary)

  // 🔹 Open Modal After Drop
  const handleDropActivity = (e, hour) => {
    e.preventDefault();
  
    // ✅ Extract activity from the drag event
    const activityData = e.dataTransfer.getData("activity");
    if (!activityData) {
      console.error("❌ No activity data found in drag event.");
      return;
    }
  
    const activity = JSON.parse(activityData);
  
    setSelectedActivity(activity);
    setStartTime("");
    setEndTime("");
    setShowModal(true);
  };
  
  

  // 🔹 Handle Saving Activity
  const handleSaveActivity = () => {
    if (!startTime || !endTime || endTime <= startTime) {
      alert("❌ Please enter valid start and end times.");
      return;
    }
  
    console.log("🔍 Selected Activity Before Save:", selectedActivity); // ✅ Debug log
  
    const newActivity = {
      id: selectedActivity?.id || "❌ Missing ID",
      title: selectedActivity?.title || "❌ Missing Title",
      startTime,
      endTime,
      cost: Number(selectedActivity?.cost) || 0,
      color,
    };
  
    console.log("✅ Adding Activity to DayPlan:", newActivity); // ✅ Debug log
    console.log("📅 Current Day Plan:", dayPlan); // ✅ Log before update
  
    if (!Array.isArray(dayPlan)) {
      console.error("❌ dayPlan is not an array:", dayPlan);
      return;
    }
  
    updateDayPlan([...dayPlan, newActivity]); // ✅ Ensure it's always an array
  
    setShowModal(false);
    setStartTime("");
    setEndTime("");
    setColor("#007bff");
  };
  
  
  
  
  

  // 🔹 Handle Deleting Activity
  const handleDeleteActivity = (index) => {
    const removedActivity = dayPlan[index];
    updateDayPlan(dayPlan.filter((_, i) => i !== index));

    if (typeof updateAvailableActivities === "function") {
      updateAvailableActivities((prev) => [...prev, removedActivity]);
    }
  };

  return (
    <>
      {/* 🔹 Activity Table */}
      <DayTable dayPlan={dayPlan} onDeleteActivity={handleDeleteActivity} onDropActivity={handleDropActivity} />

      {/* 🔹 Activity Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Set Activity Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedActivity && (
            <>
              <p><strong>Activity:</strong> {selectedActivity.title}</p>
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
                <Form.Group className="mb-3">
                  <Form.Label>Block Color</Form.Label>
                  <Form.Control
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveActivity}>Add to Schedule</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DaySchedule;
