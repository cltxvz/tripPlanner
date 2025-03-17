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
const columnTracker = new Map(); // ✅ Tracks active columns at each time slot
const rowSpanTracker = new Map(); // ✅ Tracks row span for each activity

dayPlan.forEach((activity) => {
    const startMinutes = timeToMinutes(activity.startTime);
    const endMinutes = timeToMinutes(activity.endTime);
    const startSlot = Math.floor(startMinutes / 60);
    const endSlot = Math.ceil(endMinutes / 60);
    const rowSpan = endSlot - startSlot; // ✅ Calculate how many rows this activity should span

    let columnIndex = 0;

    // ✅ Ensure column is not already occupied
    for (let i = startSlot; i < endSlot; i++) {
        if (!columnTracker.has(i)) {
            columnTracker.set(i, new Set());
        }
        while (columnTracker.get(i).has(columnIndex)) {
            columnIndex++; // ✅ Move to next available column
        }
    }

    // ✅ Store used column index for all affected slots
    for (let i = startSlot; i < endSlot; i++) {
        columnTracker.get(i).add(columnIndex);
        if (!activityMap.has(i)) {
            activityMap.set(i, []);
        }

        const row = activityMap.get(i);
        while (row.length <= columnIndex) {
            row.push(null);
        }

        // ✅ Store row span only in the first slot of the activity
        if (i === startSlot) {
            row[columnIndex] = { activity, rowSpan };
            rowSpanTracker.set(activity, rowSpan); // ✅ Save row span for reference
        } else {
            row[columnIndex] = null; // ✅ Empty slot (merged in table)
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
        const columnCount = Math.max(...Array.from(activityMap.values(), (acts) => acts.length), 1); // ✅ Adjust dynamically

        return (
            <tr key={index} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropActivity(e, hour)}>
                <td className="text-center">{hour}</td>

                {Array.from({ length: columnCount }, (_, colIndex) => {
                    const activityEntry = activities[colIndex];

                    // ✅ If activity is `null`, skip it (part of merged row)
                    if (activityEntry === null) return null;

                    // ✅ Extract activity and row span
                    const { activity, rowSpan } = activityEntry || {};

                    return activity ? (
                        <td
                            key={colIndex}
                            rowSpan={rowSpan} // ✅ Merge rows
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
                        </td>
                    ) : <td key={colIndex}></td>; // ✅ Empty cell (keeps table structure)
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
