import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

function ActionButtons({ setShowEditModal }) {
    const navigate = useNavigate();

    return (
        <div className="text-center my-3">
            <Button variant="secondary" onClick={() => navigate("/")} className="m-2">
                🏠 Start Over
            </Button>
            <Button variant="warning" onClick={() => setShowEditModal(true)} className="m-2">
                ✏️ Edit Trip
            </Button>
            <Button variant="info" onClick={() => navigate("/activities")} className="m-2">
                📋 Manage Activities
            </Button>
            <Button variant="primary" className="m-2">
                📥 Import Trip
            </Button>
            <Button variant="success" className="m-2">
                📤 Export Trip
            </Button>
        </div>
    );
}

export default ActionButtons;
