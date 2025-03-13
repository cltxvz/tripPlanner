import { Alert } from "react-bootstrap";
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
import { Card } from "react-bootstrap";

function TripOverview() {
  const navigate = useNavigate();
  const [updateBudget, setUpdateBudget] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const [forceRender, setForceRender] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState("danger");

  // Function to trigger budget update
  const handleExpensesUpdate = () => {
    setUpdateBudget((prev) => !prev);
  };

  // Function to refresh trip details when edited
  const refreshTripDetails = useCallback(() => {
    const updatedTrip = JSON.parse(localStorage.getItem("tripDetails")) || {};
    setTripDetails(updatedTrip);
    setForceRender((prev) => !prev);
    handleExpensesUpdate();
  }, []);

  // Function to show alerts
  const showAlert = (message, variant = "danger") => {
    setAlertMessage(message);
    setAlertVariant(variant);

    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  useEffect(() => {
    const storedTrip = JSON.parse(localStorage.getItem("tripDetails"));
    if (!storedTrip || !storedTrip.destination) {
      navigate("/");
    } else {
      setTripDetails(storedTrip);
    }
  }, [navigate]);

  return (
    <div key={forceRender}>
      <TripHeader tripDetails={tripDetails} />

      {/* Pass showAlert to ActionButtons */}
      <ActionButtons refreshTripDetails={refreshTripDetails} showAlert={showAlert} />

      {/* Show alert below action buttons */}
      {alertMessage && (
        <div className="container mt-3">
          <Alert variant={alertVariant} className="text-center">
            {alertMessage}
          </Alert>
        </div>
      )}

      <div className="container mt-4 mb-4">
        {/* Flights & Stays Section */}
        <div className="row gx-4 align-items-stretch">
          <div className="col-md-6 d-flex">
            <div className="w-100 h-100">
              <Flights onBudgetUpdate={handleExpensesUpdate} />
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="w-100 h-100">
              <Stay onBudgetUpdate={handleExpensesUpdate} />
            </div>
          </div>
        </div>

        {/* Trip Days Section */}
        <div className="row mt-4">
          <div className="col-12">
            <TripDays key={forceRender} />
          </div>
        </div>

        {/* Expenses, Budget & To-Do */}
        <div className="row mt-4 gx-4 align-items-stretch">
          <div className="col-md-4 d-flex">
            <Card className="shadow-sm w-100 h-100 d-flex flex-column">
              <Card.Body className="d-flex flex-column justify-content-between">
                <AdditionalExpenses onExpensesUpdate={handleExpensesUpdate} />
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4 d-flex">
            <Card className="shadow-sm w-100 h-100 d-flex flex-column">
              <Card.Body className="d-flex flex-column justify-content-between">
                <BudgetAndCosts updateTrigger={updateBudget} />
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4 d-flex">
            <Card className="shadow-sm w-100 h-100 d-flex flex-column">
              <Card.Body className="d-flex flex-column justify-content-between">
                <ToDoList />
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default TripOverview;
