import React, { useState, useEffect, useCallback } from "react";
import { Button, Card, ListGroup, Modal, Form } from "react-bootstrap";

function AdditionalExpenses({ onExpensesUpdate }) {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState({ title: "", cost: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  // 🔹 Function to Calculate Total Expenses
  const calculateTotal = useCallback((updatedExpenses) => {
    const total = updatedExpenses.reduce((sum, expense) => sum + parseFloat(expense.cost || 0), 0);
    setTotalExpenses(total.toFixed(2));

    // ✅ Save total to localStorage for BudgetAndCosts.js
    localStorage.setItem("totalAdditionalExpenses", total.toFixed(2));
  }, []);

  // 🟢 Load Expenses from LocalStorage on Mount
  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem("additionalExpenses")) || [];
    setExpenses(storedExpenses);
    calculateTotal(storedExpenses); // ✅ Run once on mount
  }, [calculateTotal]);

  // 🔹 Handle Save (Add/Edit) Expense
  const handleSaveExpense = () => {
    if (!expenseData.title || isNaN(expenseData.cost) || parseFloat(expenseData.cost) < 0) {
      alert("❌ Please enter valid expense details.");
      return;
    }

    let updatedExpenses = [...expenses];

    if (editingIndex !== null) {
      // Edit existing expense
      updatedExpenses[editingIndex] = { ...expenseData, cost: parseFloat(expenseData.cost) };
    } else {
      // Add new expense
      updatedExpenses.push({ ...expenseData, cost: parseFloat(expenseData.cost) });
    }

    // ✅ Update localStorage first
    localStorage.setItem("additionalExpenses", JSON.stringify(updatedExpenses));

    // ✅ Update state & budget
    setExpenses(updatedExpenses);
    calculateTotal(updatedExpenses); // ✅ Immediately update budget

    // ✅ Notify TripOverview SAFELY after re-render
    setTimeout(() => {
      if (onExpensesUpdate) onExpensesUpdate();
    }, 0);

    // Reset form & close modal
    resetForm();
  };

  // 🔹 Handle Edit Expense
  const handleEditExpense = (index) => {
    setExpenseData(expenses[index]);
    setEditingIndex(index);
    setShowExpenseModal(true);
  };

  // 🔹 Handle Delete Expense
  const handleDeleteExpense = (index) => {
    let updatedExpenses = expenses.filter((_, i) => i !== index);

    // ✅ Update localStorage first
    localStorage.setItem("additionalExpenses", JSON.stringify(updatedExpenses));

    // ✅ Update state & budget
    setExpenses(updatedExpenses);
    calculateTotal(updatedExpenses); // ✅ Immediately update budget

    // ✅ Notify TripOverview SAFELY after re-render
    setTimeout(() => {
      if (onExpensesUpdate) onExpensesUpdate();
    }, 0);
  };

  // 🔹 Reset Form Fields
  const resetForm = () => {
    setExpenseData({ title: "", cost: "" });
    setEditingIndex(null);
    setShowExpenseModal(false);
  };

  return (
    <>
      {/* 💸 Additional Expenses Card */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>💸 Additional Expenses</Card.Title>
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
            variant="outline-danger"
            onClick={() => {
              resetForm();
              setShowExpenseModal(true);
            }}
          >
            ➕ Add Expense
          </Button>
        </Card.Body>
      </Card>

      {/* 🔹 Expense Modal */}
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
                onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost ($)</Form.Label>
              <Form.Control
                type="number"
                value={expenseData.cost}
                onChange={(e) => setExpenseData({ ...expenseData, cost: e.target.value })}
                min="0"
                step="0.01"
              />
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
