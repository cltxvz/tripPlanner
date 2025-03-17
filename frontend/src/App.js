import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TripOverview from "./pages/TripOverview";
import Activities from "./pages/Activities";
import Planner from "./pages/Planner";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trip" element={<TripOverview />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/planner" element={<Planner />} />
            </Routes>
        </Router>
    );
}

export default App;
