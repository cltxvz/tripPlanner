import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import TripHeader from "../components/TripOverview/TripHeader";
import Footer from "../components/Footer";
import ActionButtons from "../components/TripOverview/ActionButtons";
import FlightsAndStay from "../components/TripOverview/FlightsAndStay";
import TripDays from "../components/TripOverview/TripDays";
import Extras from "../components/TripOverview/Extras";

function TripOverview() {
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        const storedTrip = JSON.parse(localStorage.getItem("tripDetails"));
        if (storedTrip) setTrip(storedTrip);
        else navigate("/");
    }, [navigate]);

    return (
        <>
            {/* ✅ Pass trip details to the header */}
            <TripHeader
                destination={trip?.destination}
                days={trip?.days}
                travelers={trip?.people}
            />

            <Container className="mt-4">
                {trip && (
                    <>
                        <ActionButtons />
                        <FlightsAndStay />
                        <TripDays />
                        <Extras />
                    </>
                )}
            </Container>

            <Footer />
        </>
    );
}

export default TripOverview;
