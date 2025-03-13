import React, { useState, useEffect, useCallback } from "react";
import { Button, Card, ListGroup, Modal, Form } from "react-bootstrap";

function AdditionalExpenses({ onExpensesUpdate }) {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState({ title: "", cost: "" });
  const [errors, setErrors] = useState({ title: "", cost: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  // Function to Calculate Total Expenses
  const calculateTotal = useCallback((updatedExpenses) => {
    const total = updatedExpenses.reduce((sum, expense) => sum + parseFloat(expense.cost || 0), 0);
    setTotalExpenses(total.toFixed(2));

    // Save total to localStorage for BudgetAndCosts.js
    localStorage.setItem("totalAdditionalExpenses", total.toFixed(2));
  }, []);

  // Load Expenses from LocalStorage on Mount
  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem("additionalExpenses")) || [];
    setExpenses(storedExpenses);
    calculateTotal(storedExpenses);
  }, [calculateTotal]);

  // Validate Inputs (Real-time)
  const validateForm = () => {
    let valid = true;
    let newErrors = { title: "", cost: "" };

    if (!expenseData.title.trim()) {
      newErrors.title = "Title is required.";
      valid = false;
    } else if (expenseData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
      valid = false;
    }

    if (expenseData.cost === "" || isNaN(expenseData.cost)) {
      newErrors.cost = "Cost must be a valid number.";
      valid = false;
    } else if (parseFloat(expenseData.cost) < 0) {
      newErrors.cost = "Cost cannot be negative.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle Input Change & Live Validation
  const handleInputChange = (field, value) => {
    setExpenseData((prev) => ({ ...prev, [field]: value }));

    // Live validation
    let newErrors = { ...errors };
    if (field === "title") {
      newErrors.title = value.trim().length < 3 ? "Title must be at least 3 characters." : "";
    } else if (field === "cost") {
      newErrors.cost =
        value === "" || isNaN(value) ? "Cost must be a valid number." :
        parseFloat(value) < 0 ? "Cost cannot be negative." :
        "";
    }
    setErrors(newErrors);
  };

  // Handle Save (Add/Edit) Expense
  const handleSaveExpense = () => {
    if (!validateForm()) return;

    let updatedExpenses = [...expenses];

    if (editingIndex !== null) {
      updatedExpenses[editingIndex] = { ...expenseData, cost: parseFloat(expenseData.cost) };
    } else {
      updatedExpenses.push({ ...expenseData, cost: parseFloat(expenseData.cost) });
    }

    // Update localStorage first
    localStorage.setItem("additionalExpenses", JSON.stringify(updatedExpenses));

    // Update state & budget
    setExpenses(updatedExpenses);
    calculateTotal(updatedExpenses); // Immediately update budget

    // Notify TripOverview
    setTimeout(() => {
      if (onExpensesUpdate) onExpensesUpdate();
    }, 0);

    resetForm();
  };

  // Handle Edit Expense
  const handleEditExpense = (index) => {
    setExpenseData(expenses[index]);
    setEditingIndex(index);
    setErrors({ title: "", cost: "" }); // Reset errors when opening modal
    setShowExpenseModal(true);
  };

  // Handle Delete Expense
  const handleDeleteExpense = (index) => {
    let updatedExpenses = expenses.filter((_, i) => i !== index);
    localStorage.setItem("additionalExpenses", JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
    calculateTotal(updatedExpenses);
    setTimeout(() => {
      if (onExpensesUpdate) onExpensesUpdate();
    }, 0);
  };

  // Reset Form Fields
  const resetForm = () => {
    setExpenseData({ title: "", cost: "" });
    setEditingIndex(null);
    setErrors({ title: "", cost: "" }); // Reset errors when closing modal
    setShowExpenseModal(false);
  };

  return (
    <>
      {/* Additional Expenses Card */}
      <Card className="border-0">
        <Card.Body>
          <Card.Title className="text-center mb-3">💸 Additional Expenses</Card.Title>
          <ListGroup variant="flush">
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <span>{expense.title}: ${expense.cost.toFixed(2)}</span>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditExpense(index)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteExpense(index)}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No additional expenses.</ListGroup.Item>
            )}
          </ListGroup>
          <p className="mt-2"><strong>Total Additional Expenses:</strong> ${totalExpenses}</p>
          <Button
            variant="danger"
            className="mt-3 w-100"
            onClick={() => {
              resetForm();
              setShowExpenseModal(true);
            }}
          >
            ➕ Add Expense
          </Button>
        </Card.Body>
      </Card>

      {/* Expense Modal */}
      <Modal show={showExpenseModal} onHide={() => setShowExpenseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingIndex !== null ? "Edit Expense" : "Add Expense"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={expenseData.title}
                isInvalid={!!errors.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cost ($)</Form.Label>
              <Form.Control
                type="number"
                value={expenseData.cost}
                isInvalid={!!errors.cost}
                onChange={(e) => handleInputChange("cost", e.target.value)}
                min="0"
                step="0.01"
              />
              <Form.Control.Feedback type="invalid">
                {errors.cost}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExpenseModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveExpense}>
            {editingIndex !== null ? "Save Changes" : "Add Expense"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AdditionalExpenses;
