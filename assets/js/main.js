// DOM Elements
const destinationInput = document.getElementById('destination');
const destinationSuggestions = document.getElementById('destination-suggestions');

// OpenCage API Key (Replace YOUR_API_KEY)
const API_KEY = 'f71bc728a85d40a692e5d5d7b62bd559';
const API_URL = 'https://api.opencagedata.com/geocode/v1/json';

// Fetch Location Suggestions
async function fetchLocationSuggestions(query) {
    if (!query || query.length < 3) {
        console.warn('⚠️ Query is too short for API request:', query);
        destinationSuggestions.innerHTML = '<li>Type at least 3 characters...</li>';
        return;
    }

    destinationSuggestions.innerHTML = '<li>Loading suggestions...</li>';

    try {
        const response = await fetch(
            `${API_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}&limit=5`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch location suggestions');
        }

        const data = await response.json();
        console.log('📦 OpenCage API Response:', data);
        displaySuggestions(data.results);
    } catch (error) {
        console.error('❌ Error fetching suggestions:', error);
        destinationSuggestions.innerHTML = '<li>Failed to fetch suggestions. Try again later.</li>';
    }
}

// Debounce Function
function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Event Listener with Debounce
destinationInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.trim();
    fetchLocationSuggestions(query);
}, 300)); // 300ms delay

// Display Suggestions
function displaySuggestions(suggestions) {
    destinationSuggestions.innerHTML = '';

    if (!suggestions.length) {
        destinationSuggestions.innerHTML = '<li>No results found</li>';
        return;
    }

    suggestions.forEach(suggestion => {
        const placeName = suggestion.formatted;
        const li = document.createElement('li');
        li.textContent = placeName;
        li.addEventListener('click', () => selectSuggestion(placeName));
        destinationSuggestions.appendChild(li);
    });
}

// Select Suggestion
function selectSuggestion(placeName) {
    destinationInput.value = placeName;
    destinationSuggestions.innerHTML = '';
}

// Close Dropdown on Outside Click
document.addEventListener('click', (e) => {
    if (!destinationInput.contains(e.target) && !destinationSuggestions.contains(e.target)) {
        destinationSuggestions.innerHTML = '';
    }
});

// Trip Form Submission
document.getElementById('trip-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const destination = document.getElementById('destination').value;
    const days = parseInt(document.getElementById('days').value, 10);
    const people = parseInt(document.getElementById('people').value, 10);

    if (destination && days > 0 && people > 0) {
        localStorage.setItem('tripDetails', JSON.stringify({ destination, days, people }));
        window.location.href = 'trip.html';
    } else {
        alert('Please fill all fields correctly.');
    }
});

// Import Trip Data from JSON File
function importTripData(event, redirectToTrip = false) {
    const file = event.target.files[0];
  
    if (!file) {
        alert("❌ No file selected.");
        return;
    }
  
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const tripData = JSON.parse(event.target.result);
  
            // Validate JSON structure
            if (!tripData.tripDetails || !tripData.dayPlans || !tripData.activities) {
                throw new Error("Invalid trip data format.");
            }
  
            console.log("📥 Valid Trip Data Loaded:", tripData);
  
            // Store everything in localStorage
            localStorage.setItem("tripDetails", JSON.stringify(tripData.tripDetails));
            localStorage.setItem("flights", JSON.stringify(tripData.flights || []));
            localStorage.setItem("stays", JSON.stringify(tripData.stays || []));
            localStorage.setItem("dayPlans", JSON.stringify(tripData.dayPlans || {}));
            localStorage.setItem("activities", JSON.stringify(tripData.activities || []));
            localStorage.setItem("additionalExpenses", JSON.stringify(tripData.additionalExpenses || []));
            localStorage.setItem("todoList", JSON.stringify(tripData.todoList || []));
  
            console.log("✅ Trip data imported and saved in localStorage.");
  
            // Redirect to trip page after import (for index.html)
            if (redirectToTrip) {
                window.location.href = "trip.html";
            } else {
                // Refresh page to reflect imported data
                window.location.reload();
            }
  
        } catch (error) {
            console.error("❌ Error importing trip data:", error);
            alert("❌ Failed to import trip. Please upload a valid JSON file.");
        }
    };
  
    reader.readAsText(file);
  }

// Import Trip Functionality
const importTripBtnIndex = document.getElementById("import-trip-btn");
const importTripInputIndex = document.getElementById("import-trip-input");

if (importTripBtnIndex && importTripInputIndex) {
    importTripBtnIndex.addEventListener("click", () => importTripInputIndex.click());
    importTripInputIndex.addEventListener("change", (event) => importTripData(event, true));
}

