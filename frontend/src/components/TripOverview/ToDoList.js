import React, { useState, useEffect } from "react";
import { Button, Card, ListGroup, Modal, Form } from "react-bootstrap";

function ToDoList() {
  const [todoList, setTodoList] = useState([]);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  const [errors, setErrors] = useState("");
  const [editingTodoIndex, setEditingTodoIndex] = useState(null);

  // Load To-Do List from LocalStorage
  useEffect(() => {
    const storedTodoList = JSON.parse(localStorage.getItem("todoList")) || [];
    setTodoList(storedTodoList);
  }, []);

  // Save To-Do List to LocalStorage
  const saveToLocalStorage = (updatedList) => {
    localStorage.setItem("todoList", JSON.stringify(updatedList));
    setTodoList(updatedList);
  };

  // Handle Checkbox Toggle (Mark as Completed)
  const toggleCompletion = (index) => {
    const updatedList = [...todoList];
    updatedList[index].completed = !updatedList[index].completed; // Toggle checked state
    saveToLocalStorage(updatedList);
  };

  // Validate To-Do Input
  const validateForm = () => {
    if (!todoTitle.trim()) {
      setErrors("To-Do title is required.");
      return false;
    } else if (todoTitle.length < 3) {
      setErrors("To-Do title must be at least 3 characters.");
      return false;
    }

    setErrors("");
    return true;
  };

  // Handle Save (Add/Edit) To-Do
  const handleSaveToDo = () => {
    if (!validateForm()) return;

    let updatedList = [...todoList];

    if (editingTodoIndex !== null) {
      // Edit existing to-do
      updatedList[editingTodoIndex].title = todoTitle;
    } else {
      // Add new to-do
      updatedList.push({ title: todoTitle, completed: false });
    }

    // Save & Reset Form
    saveToLocalStorage(updatedList);
    resetForm();
  };

  // Handle Delete To-Do
  const handleDeleteToDo = (index) => {
    const updatedList = todoList.filter((_, i) => i !== index);
    saveToLocalStorage(updatedList);
  };

  // Reset Form Fields
  const resetForm = () => {
    setTodoTitle("");
    setErrors(""); // Reset errors
    setEditingTodoIndex(null);
    setShowTodoModal(false);
  };

  return (
    <>
      {/* To-Do List Card */}
      <Card className="border-0">
        <Card.Body>
          <Card.Title className="text-center mb-3">✅ To-Do List</Card.Title>
          <ListGroup variant="flush">
            {todoList.length > 0 ? (
              todoList.map((todo, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      className="me-2"
                      checked={todo.completed}
                      onChange={() => toggleCompletion(index)}
                    />
                    <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                      {todo.title}
                    </span>
                  </div>
                  <div>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => {
                        setTodoTitle(todo.title);
                        setErrors(""); // Reset errors
                        setEditingTodoIndex(index);
                        setShowTodoModal(true);
                      }}
                    >
                      ✏️ Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDeleteToDo(index)}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No to-dos yet.</ListGroup.Item>
            )}
          </ListGroup>
          <Button 
            variant="warning" 
            className="mt-3 w-100" 
            onClick={() => {
              resetForm();
              setShowTodoModal(true);
            }}
          >
            ➕ Add To-Do
          </Button>
        </Card.Body>
      </Card>

      {/* To-Do Modal */}
      <Modal show={showTodoModal} onHide={() => setShowTodoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingTodoIndex !== null ? "Edit To-Do" : "Add To-Do"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={todoTitle}
                isInvalid={!!errors} // Apply Bootstrap validation
                onChange={(e) => {
                  setTodoTitle(e.target.value);
                  setErrors(""); // Clear error when user types
                }}
              />
              <Form.Control.Feedback type="invalid">
                {errors}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTodoModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveToDo}>
            {editingTodoIndex !== null ? "Save Changes" : "Add To-Do"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ToDoList;
