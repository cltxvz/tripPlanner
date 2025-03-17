import React, { useState, useEffect } from "react";
import { Button, Card, Modal, Form } from "react-bootstrap";

function BudgetAndCosts({ updateTrigger }) {
  const [budget, setBudget] = useState(0);
  const [totalCostAllTravelers, setTotalCostAllTravelers] = useState(0);
  const [totalCostPerPerson, setTotalCostPerPerson] = useState(0);
  const [totalBudgetAllTravelers, setTotalBudgetAllTravelers] = useState(0);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [error, setError] = useState(""); // 🔹 Track validation errors

  // Load Budget & Costs from LocalStorage
  useEffect(() => {
    updateBudgetAndCosts();
  }, [updateTrigger]); // Refresh when updateTrigger changes

  // Function to Update Costs
  const updateBudgetAndCosts = () => {
    const tripDetails = JSON.parse(localStorage.getItem("tripDetails")) || {};
    const flights = JSON.parse(localStorage.getItem("flights")) || [];
    const stays = JSON.parse(localStorage.getItem("stays")) || [];
    const additionalExpenses = JSON.parse(localStorage.getItem("additionalExpenses")) || [];
    const numberOfTravelers = parseInt(tripDetails.people) || 1;

    // Flights Total Cost
    const flightsTotalCost = flights.reduce((sum, flight) => sum + parseFloat(flight.cost || 0), 0);

    // Stays Total Cost
    const staysTotalCost = stays.reduce((sum, stay) => sum + parseFloat(stay.cost || 0), 0);

    // Trip Days Total Cost
    let tripDaysTotalCost = 0;
    if (tripDetails.dayPlans) {
      tripDaysTotalCost = Object.values(tripDetails.dayPlans).reduce((sum, day) => {
        const dailyTotal = day.dayPlan ? 
          day.dayPlan.reduce((daySum, activity) => daySum + parseFloat(activity.cost || 0), 0) 
          : 0;
        
        return sum + (dailyTotal * numberOfTravelers);
      }, 0);
    }

    // Additional Expenses Total
    const additionalExpensesTotal = additionalExpenses.reduce((sum, expense) => sum + parseFloat(expense.cost || 0), 0);

    // Calculate Total Cost
    const totalAllTravelers = flightsTotalCost + staysTotalCost + tripDaysTotalCost + additionalExpensesTotal;
    const totalPerPerson = totalAllTravelers / numberOfTravelers;

    // Load Budget
    const storedBudget = parseFloat(tripDetails.budget) || 0;
    const budgetPerPerson = storedBudget.toFixed(2);
    const budgetAllTravelers = (storedBudget * numberOfTravelers).toFixed(2);

    // Update State
    setTotalCostAllTravelers(totalAllTravelers.toFixed(2));
    setTotalCostPerPerson(totalPerPerson.toFixed(2));
    setBudget(budgetPerPerson);
    setTotalBudgetAllTravelers(budgetAllTravelers);

    // Save Updated Costs in LocalStorage
    tripDetails.totalCostAllTravelers = totalAllTravelers;
    tripDetails.totalCostPerPerson = totalPerPerson;
    tripDetails.totalBudgetAllTravelers = budgetAllTravelers;
    localStorage.setItem("tripDetails", JSON.stringify(tripDetails));
  };

  // Handle Budget Save with Validation
  const handleSaveBudget = () => {
    const newBudget = parseFloat(budgetInput);

    // Validation
    if (isNaN(newBudget) || newBudget < 0) {
      setError("Budget must be a valid number and cannot be negative.");
      return;
    }

    // Load Trip Details & Update
    const tripDetails = JSON.parse(localStorage.getItem("tripDetails")) || {};
    const numberOfTravelers = parseInt(tripDetails.people) || 1;

    tripDetails.budget = newBudget;
    tripDetails.totalBudgetAllTravelers = (newBudget * numberOfTravelers).toFixed(2);

    // Save to LocalStorage
    localStorage.setItem("tripDetails", JSON.stringify(tripDetails));

    // Update State
    setBudget(newBudget.toFixed(2));
    setTotalBudgetAllTravelers((newBudget * numberOfTravelers).toFixed(2));

    // Close modal
    setShowBudgetModal(false);
  };

  return (
    <>
      {/* Budget & Costs Section */}
      <Card className="border-0">
        <Card.Body>
          <Card.Title className="text-center mb-3">💰 Budget & Costs</Card.Title>

          {/* Budget & Costs for All Travelers */}
          <div className="budget-group mb-3">
            <h5 className="text-primary">All Travelers</h5>
            <ul className="list-unstyled">
              <li><strong>Total Cost:</strong> ${totalCostAllTravelers}</li>
              <li><strong>Total Budget:</strong> ${totalBudgetAllTravelers}</li>
            </ul>
          </div>

          {/* Budget & Costs Per Person */}
          <div className="budget-group">
            <h5 className="text-success">Per Person</h5>
            <ul className="list-unstyled">
              <li><strong>Total Cost:</strong> ${totalCostPerPerson}</li>
              <li><strong>Total Budget:</strong> ${budget}</li>
            </ul>
          </div>

          {/* Edit Budget Button */}
          <Button
            variant="success"
            className="mt-3 w-100"
            onClick={() => {
              setBudgetInput(""); // Reset input when opening modal
              setError(""); // Reset validation error
              setShowBudgetModal(true);
            }}
          >
            ✏️ Edit Budget
          </Button>
        </Card.Body>
      </Card>

      {/* Budget Edit Modal */}
      <Modal show={showBudgetModal} onHide={() => setShowBudgetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Trip Budget (Per Person)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Set Budget ($)</Form.Label>
              <Form.Control
                type="number"
                value={budgetInput}
                isInvalid={!!error} // Apply Bootstrap validation
                onChange={(e) => {
                  setBudgetInput(e.target.value);
                  setError(""); // Clear error when user types
                }}
                min="0"
                step="0.01"
                placeholder="Enter budget amount"
              />
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBudgetModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveBudget}>Save Budget</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BudgetAndCosts;
