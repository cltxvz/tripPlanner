// 📌 DOM Elements
const destinationInput = document.getElementById('destination');
const destinationSuggestions = document.getElementById('destination-suggestions');

// 🌍 OpenCage API Key (Replace YOUR_API_KEY)
const API_KEY = 'f71bc728a85d40a692e5d5d7b62bd559';
const API_URL = 'https://api.opencagedata.com/geocode/v1/json';

// 📥 Fetch Suggestions
async function fetchLocationSuggestions(query) {
    if (!query) {
        destinationSuggestions.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}&limit=5`
        );

        if (!response.ok) throw new Error('Failed to fetch location suggestions');

        const data = await response.json();
        console.log('📦 OpenCage API Response:', data);
        displaySuggestions(data.results);
    } catch (error) {
        console.error('❌ Error fetching suggestions:', error);
    }
}

// 📋 Display Suggestions
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

// ✅ Select Suggestion
function selectSuggestion(placeName) {
    destinationInput.value = placeName;
    destinationSuggestions.innerHTML = '';
}

// 🚀 Event Listener for Input
destinationInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    fetchLocationSuggestions(query);
});

// ❌ Close Dropdown on Outside Click
document.addEventListener('click', (e) => {
    if (!destinationInput.contains(e.target) && !destinationSuggestions.contains(e.target)) {
        destinationSuggestions.innerHTML = '';
    }
});




// 🚀 Trip Form Submission
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

// 📥 Import Trip Functionality
const importTripBtn = document.getElementById('import-trip-btn');

importTripBtn.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.addEventListener('change', handleTripImport);
  input.click();
});

// 📥 Handle Import Trip Data
function handleTripImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
      try {
          const tripData = JSON.parse(e.target.result);

          // Validate JSON Structure
          if (!tripData.tripDetails || !tripData.activities) {
              throw new Error('Invalid trip file format');
          }

          // Validate Required Trip Details
          const { destination, days, people } = tripData.tripDetails;
          if (!destination || days <= 0 || people <= 0) {
              throw new Error('Invalid trip details in file');
          }

          // Save Data to LocalStorage
          localStorage.setItem('tripDetails', JSON.stringify(tripData.tripDetails));
          localStorage.setItem('activities', JSON.stringify(tripData.activities));

          alert('✅ Trip imported successfully! Redirecting to Trip Overview...');
          window.location.href = 'trip.html';

      } catch (error) {
          console.error('❌ Import failed:', error.message);
          alert('❌ Invalid file format. Please upload a valid trip JSON file.');
      }
  };

  reader.readAsText(file);
}
