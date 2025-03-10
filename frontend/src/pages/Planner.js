import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DaySchedule from "../components/Planner/DaySchedule";
import AvailableActivities from "../components/Planner/AvailableActivities";
import TotalCost from "../components/Planner/TotalCost";
import PlannerHeader from "../components/Planner/PlannerHeader"; // ✅ New header
import Footer from "../components/Footer";

function Planner() {
  const navigate = useNavigate();
  const [dayPlan, setDayPlan] = useState([]);
  const [activities, setActivities] = useState([]);
  const [numberOfTravelers, setNumberOfTravelers] = useState(1);

  useEffect(() => {
    // Ensure a trip and a selected day exist, otherwise navigate back
    const storedTrip = JSON.parse(localStorage.getItem("tripDetails"));
    const selectedDay = localStorage.getItem("selectedDay");

    if (!storedTrip || !selectedDay) {
      navigate("/");
      return;
    }

    // Load the number of travelers
    setNumberOfTravelers(storedTrip.people || 1);

    // Load the current day's plan from localStorage
    const tripDetails = JSON.parse(localStorage.getItem("tripDetails")) || {};
    const currentDayPlan = tripDetails.dayPlans?.[selectedDay]?.dayPlan || [];

    setDayPlan(currentDayPlan);

    // Load activities from localStorage
    const savedActivities = JSON.parse(localStorage.getItem("activities")) || [];
    setActivities(savedActivities);
  }, [navigate]);

  // 🔹 Function to update the day plan
  const updateDayPlan = (newDayPlan) => {
    setDayPlan(newDayPlan);

    // Save updated plan in localStorage
    const tripDetails = JSON.parse(localStorage.getItem("tripDetails")) || {};
    const selectedDay = localStorage.getItem("selectedDay");

    if (tripDetails.dayPlans) {
      tripDetails.dayPlans[selectedDay] = {
        dayPlan: newDayPlan,
        totalCost: newDayPlan.reduce((sum, activity) => sum + parseFloat(activity.cost || 0), 0) * numberOfTravelers,
      };
    } else {
      tripDetails.dayPlans = {
        [selectedDay]: {
          dayPlan: newDayPlan,
          totalCost: newDayPlan.reduce((sum, activity) => sum + parseFloat(activity.cost || 0), 0) * numberOfTravelers,
        },
      };
    }

    localStorage.setItem("tripDetails", JSON.stringify(tripDetails));
  };

  return (
    <>
      {/* 🌟 Header */}
      <PlannerHeader />

      <Container className="mt-4">
        {/* 💰 Total Cost Section */}
        <Row className="mt-4">
          <Col md={12}>
            <TotalCost dayPlan={dayPlan} numberOfTravelers={numberOfTravelers} />
          </Col>
        </Row>

        <Row>
          {/* 🗓 Day Schedule Section (Drop Zone) */}
          <Col md={6} className="mb-4">
            <DaySchedule dayPlan={dayPlan} updateDayPlan={updateDayPlan} />
          </Col>

          {/* 📌 Available Activities Section */}
          <Col md={6} className="mb-4">
            <AvailableActivities activities={activities} dayPlan={dayPlan} updateDayPlan={updateDayPlan} />
          </Col>
        </Row>
      </Container>

      {/* 🔻 Footer */}
      <Footer />
    </>
  );
}

export default Planner;
