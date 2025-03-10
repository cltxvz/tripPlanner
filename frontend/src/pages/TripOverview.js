import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TripHeader from "../components/TripOverview/TripHeader";
import ActionButtons from "../components/TripOverview/ActionButtons";
import Flights from "../components/TripOverview/Flights";
import Stay from "../components/TripOverview/Stay";
import TripDays from "../components/TripOverview/TripDays";
import AdditionalExpenses from "../components/TripOverview/AdditionalExpenses";
import BudgetAndCosts from "../components/TripOverview/BudgetAndCosts";
import ToDoList from "../components/TripOverview/ToDoList";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

function TripOverview() {
  const navigate = useNavigate();
  const [updateBudget, setUpdateBudget] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const [forceRender, setForceRender] = useState(false); // 🔄 New state to force UI updates

  // ✅ Ensure a trip exists; otherwise, navigate back to home page
  useEffect(() => {
    const storedTrip = JSON.parse(localStorage.getItem("tripDetails"));
    if (!storedTrip) {
      navigate("/");
    } else {
      setTripDetails(storedTrip);
    }
  }, [navigate]);

  // ✅ Function to trigger budget update
  const handleExpensesUpdate = () => {
    setUpdateBudget((prev) => !prev); // Toggle state to re-render BudgetAndCosts
  };

  // ✅ Function to refresh trip details when edited
  const refreshTripDetails = useCallback(() => {
    const updatedTrip = JSON.parse(localStorage.getItem("tripDetails")) || {};
    setTripDetails(updatedTrip);
    setForceRender((prev) => !prev); // 🔄 Force a re-render to update components
    handleExpensesUpdate();
  }, []);

  return (
    <div key={forceRender}> {/* 🔄 Forces re-render */}
      {/* 🌟 Header */}
      <TripHeader tripDetails={tripDetails} />

      {/* 🚀 Action Buttons */}
      <ActionButtons refreshTripDetails={refreshTripDetails} />

      <div className="container mt-4">
        {/* ✈️ Flights & 🏨 Stays Section (Fixed Layout) */}
        <div className="row">
          <div className="col-md-6">
            <Flights onBudgetUpdate={handleExpensesUpdate} />
          </div>
          <div className="col-md-6">
            <Stay onBudgetUpdate={handleExpensesUpdate} />
          </div>
        </div>

        {/* 📅 Trip Days Section */}
        <div className="row mt-4">
          <div className="col-12">
            <TripDays key={forceRender} /> {/* 🔄 Forces re-render */}
          </div>
        </div>

        {/* 💰 Expenses, Budget & To-Do (Same Row) */}
        <div className="row mt-4">
          <div className="col-md-4">
            <AdditionalExpenses onExpensesUpdate={handleExpensesUpdate} />
          </div>
          <div className="col-md-4">
            <BudgetAndCosts updateTrigger={updateBudget} />
          </div>
          <div className="col-md-4">
            <ToDoList />
          </div>
        </div>
      </div>

      {/* 🔻 Footer */}
      <Footer />
    </div>
  );
}

export default TripOverview;
