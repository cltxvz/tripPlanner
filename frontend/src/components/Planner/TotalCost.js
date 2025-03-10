import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function TotalCost({ dayPlan, numberOfTravelers }) {
  const navigate = useNavigate();
  const [totalCostPerPerson, setTotalCostPerPerson] = useState(0);
  const [totalCostForAll, setTotalCostForAll] = useState(0);

  useEffect(() => {
    // Calculate total cost
    const totalPerPerson = dayPlan.reduce((sum, activity) => sum + parseFloat(activity.cost || 0), 0);
    const totalAll = totalPerPerson * numberOfTravelers;

    setTotalCostPerPerson(totalPerPerson);
    setTotalCostForAll(totalAll);
  }, [dayPlan, numberOfTravelers]);

  // ✅ Handle finishing planning and saving to localStorage
  const handleFinishPlanning = () => {
    const tripDetails = JSON.parse(localStorage.getItem("tripDetails")) || { dayPlans: {} };
    const selectedDay = localStorage.getItem("selectedDay");

    if (!selectedDay) {
      console.error("❌ No day selected. Returning to trip overview.");
      navigate("/trip");
      return;
    }

    if (!tripDetails.dayPlans) {
      tripDetails.dayPlans = {};
    }

    // Save the total cost for the selected day
    tripDetails.dayPlans[selectedDay] = {
      dayPlan,
      totalCost: totalCostForAll,
    };

    localStorage.setItem("tripDetails", JSON.stringify(tripDetails));
    console.log(`📅 Day ${selectedDay} successfully saved.`);

    // ✅ Redirect back to Trip Overview
    navigate("/trip");
  };

  return (
    <Card className="shadow-lg p-4 mt-4">
      <Card.Body className="text-center">
        <h4>💰 Total Costs for the Day</h4>
        <p className="mt-3">
          <strong>Per Person:</strong> ${totalCostPerPerson.toFixed(2)}
        </p>
        <p>
          <strong>For All Travelers:</strong> ${totalCostForAll.toFixed(2)}
        </p>
        <Button variant="success" className="mt-3 w-100" onClick={handleFinishPlanning}>
          ✅ Finish Planning
        </Button>
      </Card.Body>
    </Card>
  );
}

export default TotalCost;
