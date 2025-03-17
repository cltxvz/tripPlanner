import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function TotalCost({ dayPlan, numberOfTravelers }) {
  const navigate = useNavigate();
  const [totalCostPerPerson, setTotalCostPerPerson] = useState(0);
  const [totalCostForAll, setTotalCostForAll] = useState(0);

  useEffect(() => {
    // Calculate total cost but DO NOT save it to localStorage automatically
    const totalPerPerson = dayPlan.reduce((sum, activity) => sum + parseFloat(activity.cost || 0), 0);
    const totalAll = totalPerPerson * numberOfTravelers;

    setTotalCostPerPerson(totalPerPerson);
    setTotalCostForAll(totalAll);
  }, [dayPlan, numberOfTravelers]);

  // Handle finishing planning and explicitly saving to localStorage
  const handleFinishPlanning = () => {
  
    const tripDetails = JSON.parse(localStorage.getItem("tripDetails")) || { dayPlans: {} };
    const selectedDay = localStorage.getItem("selectedDay");
  
    if (!selectedDay) {
      console.error("No selected day found. Cannot save.");
      return;
    }
  
    const serializableDayPlan = dayPlan.map(({ id, title, startTime, endTime, cost, color }) => ({
      id,
      title,
      startTime,
      endTime,
      cost,
      color,
    }));
  
    tripDetails.dayPlans[selectedDay] = {
      dayPlan: serializableDayPlan,
    };
  
    localStorage.setItem("tripDetails", JSON.stringify(tripDetails));
  
    navigate("/trip");
  };
  
  return (
    <Card className="shadow-sm p-4 mt-4">
      <Card.Body className="text-center">
        <h4>💰 Total Costs for the Day</h4>
        <p className="mt-3">
          <strong>Per Person:</strong> ${totalCostPerPerson.toFixed(2)}
        </p>
        <p>
          <strong>For All Travelers:</strong> ${totalCostForAll.toFixed(2)}
        </p>
        {/* Button group */}
        <div className="d-flex flex-row gap-2">
          <Button variant="secondary" className="mt-3 w-100" onClick={() => navigate("/trip")}>
            🔙 Trip Overview
          </Button>
          <Button variant="success" className="mt-3 w-100" onClick={handleFinishPlanning}>
            ✅ Save Changes
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default TotalCost;
