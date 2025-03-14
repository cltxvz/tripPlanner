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
    const startMinutes = timeToMinutes(activity.startTime);
    const endMinutes = timeToMinutes(activity.endTime);
    const startSlot = Math.floor(startMinutes / 60);
    const endSlot = Math.ceil(endMinutes / 60);

    for (let i = startSlot; i < endSlot; i++) {
        if (!activityMap.has(i)) {
        activityMap.set(i, []); // ✅ Ensures every slot starts as an array
        }

        const activityList = activityMap.get(i);
        
        if (Array.isArray(activityList)) { // ✅ Ensure it's an array before pushing
        activityList.push(activity);
        } else {
        console.error(`❌ activityMap.get(${i}) is not an array:`, activityList);
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
        const activity = activities[colIndex];

        return (
          <td key={colIndex} className="text-center align-middle p-2"
            style={{
              minWidth: "150px",
              backgroundColor: activity ? activity.color : "transparent", // ✅ Apply custom color only if activity exists
              color: activity ? "white" : "black", // ✅ Keep text readable
              border: "1px solid #dee2e6" // ✅ Ensure proper table structure
            }}
            onClick={() => setSelectedActivity(selectedActivity === activity ? null : activity)}
          >
            {activity ? (
              <>
                <strong>{activity.title}</strong>
                <br />
                💰 Cost Per Person: ${activity.cost.toFixed(2)}
                <br />
                ({formatTime12H(timeToMinutes(activity.startTime))} - 
                {formatTime12H(timeToMinutes(activity.endTime))})
                {selectedActivity === activity && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2 float-end"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteActivity(dayPlan.indexOf(activity));
                      setSelectedActivity(null);
                    }}
                  >
                    🗑️ Remove
                  </Button>
                )}
              </>
            ) : null}
          </td>
        );
      })}
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
