import React, { useState, useEffect } from "react";
import { Button, Card, ListGroup, Modal, Form } from "react-bootstrap";

function ToDoList() {
  const [todoList, setTodoList] = useState([]);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  const [editingTodoIndex, setEditingTodoIndex] = useState(null);

  // 🟢 Load To-Do List from LocalStorage
  useEffect(() => {
    const storedTodoList = JSON.parse(localStorage.getItem("todoList")) || [];
    setTodoList(storedTodoList);
  }, []);

  // 🔹 Save To-Do List to LocalStorage
  const saveToLocalStorage = (updatedList) => {
    localStorage.setItem("todoList", JSON.stringify(updatedList));
    setTodoList(updatedList);
  };

  // 🔹 Handle Checkbox Toggle (Mark as Completed)
  const toggleCompletion = (index) => {
    const updatedList = [...todoList];
    updatedList[index].completed = !updatedList[index].completed;
    saveToLocalStorage(updatedList);
  };

  // 🔹 Handle Save (Add/Edit) To-Do
  const handleSaveToDo = () => {
    if (!todoTitle.trim()) {
      alert("❌ Please enter a valid To-Do title.");
      return;
    }

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
    setTodoTitle("");
    setEditingTodoIndex(null);
    setShowTodoModal(false);
  };

  // 🔹 Handle Delete To-Do
  const handleDeleteToDo = (index) => {
    const updatedList = todoList.filter((_, i) => i !== index);
    saveToLocalStorage(updatedList);
  };

  return (
    <>
      {/* ✅ To-Do List Card */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>✅ To-Do List</Card.Title>
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
            variant="outline-info" 
            className="mt-2" 
            onClick={() => {
              setTodoTitle("");
              setEditingTodoIndex(null);
              setShowTodoModal(true);
            }}
          >
            ➕ Add To-Do
          </Button>
        </Card.Body>
      </Card>

      {/* 🔹 To-Do Modal */}
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
                onChange={(e) => setTodoTitle(e.target.value)}
              />
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
