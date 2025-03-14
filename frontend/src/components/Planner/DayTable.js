import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

function DayTable({ dayPlan, onDeleteActivity, onDropActivity }) {
  const [selectedActivity, setSelectedActivity] = useState(null);

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
dayPlan.forEach((activity) => {

  if (!activity.id || !activity.title) {
    console.error("❌ Activity Missing Required Fields:", activity);
    return;
  }

  const startMinutes = timeToMinutes(activity.startTime);
  const endMinutes = timeToMinutes(activity.endTime);
  const startSlot = Math.floor(startMinutes / 60);
  const endSlot = Math.ceil(endMinutes / 60);
  const rowSpan = endSlot - startSlot;

  for (let i = startSlot; i < endSlot; i++) {
    if (i === startSlot) {
      activityMap.set(i, { activity, rowSpan });
    } else {
      activityMap.set(i, null);
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
              const activitySlot = activityMap.get(index);
  
              return ( // ✅ Explicitly return the JSX
                <tr key={index} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropActivity(e, hour)}>
                  <td className="text-center">{hour}</td>
                  {activitySlot ? (
                    <td rowSpan={activitySlot.rowSpan} className="bg-primary text-white p-2"
                      onClick={() => setSelectedActivity(selectedActivity === activitySlot.activity ? null : activitySlot.activity)}
                    >
                      <strong>{activitySlot.activity.title}</strong>
                      <br />
                      ({formatTime12H(timeToMinutes(activitySlot.activity.startTime))} - 
                      {formatTime12H(timeToMinutes(activitySlot.activity.endTime))})
                      {selectedActivity === activitySlot.activity && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="ms-2 float-end"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteActivity(dayPlan.indexOf(activitySlot.activity));
                            setSelectedActivity(null);
                          }}
                        >
                          🗑️ Remove
                        </Button>
                      )}
                    </td>
                  ) : activitySlot === null ? null : (
                    <td className="empty-cell"></td> // ✅ Placed comment inside {}
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
  
}

export default DayTable;
