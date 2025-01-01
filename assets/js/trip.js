// 📌 DOM Elements
const daysGrid = document.getElementById('days-grid');
const goBackBtn = document.getElementById('go-back-btn');
const manageActivitiesBtn = document.getElementById('manage-activities-btn');
const importTripBtn = document.getElementById('import-trip-btn');
const exportTripBtn = document.getElementById('export-trip-btn');

// 🚀 Load Trip Days on Page Load
document.addEventListener('DOMContentLoaded', () => {
  loadTripDays();
});

// 🗓️ Load Trip Days into Grid
function loadTripDays() {
  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};
  daysGrid.innerHTML = '';

  if (!tripDetails.days || tripDetails.days <= 0) {
      daysGrid.innerHTML = '<p>No days planned yet. Start by planning your trip on the home page.</p>';
      return;
  }

  for (let i = 1; i <= tripDetails.days; i++) {
      const dayBlock = document.createElement('div');
      dayBlock.className = 'day-block';

      // Check if the day has a planned schedule
      const dayPlan = tripDetails.dayPlans?.[i];

      if (dayPlan) {
          dayBlock.innerHTML = `
              <h3>Day ${i}</h3>
              <p><strong>Start Time:</strong> ${dayPlan.startTime}</p>
              <p><strong>End Time:</strong> ${dayPlan.endTime}</p>
              <p><strong>Total Cost:</strong> $${dayPlan.totalCost.toFixed(2)}</p>
              <button onclick="goToDay(${i})">📝 Edit Day Plan</button>
          `;
      } else {
          dayBlock.innerHTML = `
              <h3>Day ${i}</h3>
              <p>No activities planned yet.</p>
              <button onclick="goToDay(${i})">🕒 Plan This Day</button>
          `;
      }

      daysGrid.appendChild(dayBlock);
  }
}


// 🏠 Navigate Back to Home Page
goBackBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// 📋 Navigate to Activities Page
manageActivitiesBtn.addEventListener('click', () => {
  window.location.href = 'activities.html';
});

// 📥 Import Trip Data
importTripBtn.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.addEventListener('change', handleTripImport);
  input.click();
});

// 📤 Export Trip Data
exportTripBtn.addEventListener('click', () => {
  const tripDetails = localStorage.getItem('tripDetails');
  if (!tripDetails) {
    alert('No trip data to export.');
    return;
  }

  const blob = new Blob([tripDetails], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'trip-data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// 📥 Handle Import Trip Data
function handleTripImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const tripData = JSON.parse(e.target.result);
      localStorage.setItem('tripDetails', JSON.stringify(tripData));
      alert('Trip data imported successfully!');
      loadTripDays();
    } catch (err) {
      alert('Invalid file format. Please upload a valid JSON file.');
    }
  };
  reader.readAsText(file);
}

// 📅 Navigate to Calendar Page for a Specific Day
function goToDay(dayNumber) {
  localStorage.setItem('selectedDay', dayNumber);
  window.location.href = 'calendar.html';
}

