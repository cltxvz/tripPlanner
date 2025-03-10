import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import for navigation
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button"; // ✅ Import for button

function AvailableActivities({ activities, dayPlan }) {
  const navigate = useNavigate(); // ✅ Navigation Hook
  const [unscheduledActivities, setUnscheduledActivities] = useState([]);

  useEffect(() => {
    // Filter out activities that are already scheduled
    const filteredActivities = activities.filter(
      (act) => !dayPlan.some((scheduledAct) => scheduledAct.id === act.id)
    );
    setUnscheduledActivities(filteredActivities);
  }, [activities, dayPlan]);

  return (
    <Card className="shadow-lg p-4">
      <Card.Body>
        <h4 className="text-center">🎯 Available Activities</h4>
        <ListGroup className="mt-3">
          {unscheduledActivities.length > 0 ? (
            unscheduledActivities.map((activity) => (
              <ListGroup.Item
                key={activity.id}
                className="d-flex justify-content-between align-items-center"
                draggable
                onDragStart={(e) => e.dataTransfer.setData("activity", JSON.stringify(activity))}
              >
                <div className="text-start">
                  <strong>{activity.title}</strong>
                  <p className="mb-1">{activity.description || "No description available"}</p>
                  <span className="text-muted">💰 Cost Per Person: ${parseFloat(activity.cost).toFixed(2)}</span>
                </div>
                <span className="text-muted">📌 Drag to schedule</span>
              </ListGroup.Item>
            ))
          ) : (
            <p className="text-muted text-center">No available activities.</p>
          )}
        </ListGroup>

        {/* 🔹 Manage Activities Button */}
        <div className="text-center mt-4">
          <Button variant="primary" onClick={() => navigate("/activities")}>
            📋 Manage Activities
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default AvailableActivities;
