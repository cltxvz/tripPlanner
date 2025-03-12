import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DaySchedule from "../components/Planner/DaySchedule";
import AvailableActivities from "../components/Planner/AvailableActivities";
import TotalCost from "../components/Planner/TotalCost";
import PlannerHeader from "../components/Planner/PlannerHeader";
import Footer from "../components/Footer";

function Planner() {
  const navigate = useNavigate();
  const [dayPlan, setDayPlan] = useState([]);
  const [activities, setActivities] = useState([]);
  const [numberOfTravelers, setNumberOfTravelers] = useState(1);

  // 🔹 Refresh Activities and Update Day Plans
  const refreshActivities = useCallback(() => {
    const storedActivities = JSON.parse(localStorage.getItem("activities")) || [];
    const storedTrip = JSON.parse(localStorage.getItem("tripDetails")) || { dayPlans: {} };

    if (!storedTrip.dayPlans) {
      storedTrip.dayPlans = {};
    }

    Object.keys(storedTrip.dayPlans).forEach((day) => {
      storedTrip.dayPlans[day].dayPlan = storedTrip.dayPlans[day].dayPlan.map((activity) => {
        const updatedActivity = storedActivities.find((act) => act.id === activity.id);
        return updatedActivity ? { ...activity, cost: updatedActivity.cost } : activity;
      });
    });

    setActivities(storedActivities);
    localStorage.setItem("tripDetails", JSON.stringify(storedTrip)); // ✅ Save updated trip details
  }, []);

  // ✅ Ensures a trip exists and loads necessary details
  useEffect(() => {
    const storedTrip = JSON.parse(localStorage.getItem("tripDetails")) || { dayPlans: {} };
    const selectedDay = localStorage.getItem("selectedDay");

    if (!storedTrip || !selectedDay) {
      navigate("/"); // ⏪ Redirect if trip or selected day is missing
      return;
    }

    if (!storedTrip.dayPlans) {
      storedTrip.dayPlans = {};
    }

    setNumberOfTravelers(storedTrip.people || 1);

    const currentDayPlan = storedTrip.dayPlans[selectedDay]?.dayPlan || [];
    setDayPlan(currentDayPlan);

    refreshActivities(); // ✅ Now safe to include in dependencies
  }, [navigate, refreshActivities]); // ✅ FIX: Added `refreshActivities`

  // 🔹 Function to update the day plan
  const updateDayPlan = (newDayPlan) => {
    setDayPlan(newDayPlan);

    const tripDetails = JSON.parse(localStorage.getItem("tripDetails")) || { dayPlans: {} };
    const selectedDay = localStorage.getItem("selectedDay");

    if (!tripDetails.dayPlans) {
      tripDetails.dayPlans = {};
    }

    tripDetails.dayPlans[selectedDay] = {
      dayPlan: newDayPlan,
      totalCost: newDayPlan.reduce((sum, activity) => sum + parseFloat(activity.cost || 0), 0) * numberOfTravelers,
    };

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
        {/* 🗓 Day Schedule & Available Activities */}
        <Row>
          <Col md={6} className="mb-4">
            <DaySchedule dayPlan={dayPlan} updateDayPlan={updateDayPlan} />
          </Col>

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
