// 📌 DOM Elements
const daysGrid = document.getElementById('days-grid');
const goBackBtn = document.getElementById('go-back-btn');
const manageActivitiesBtn = document.getElementById('manage-activities-btn');
const importTripBtn = document.getElementById('import-trip-btn');
const exportTripBtn = document.getElementById('export-trip-btn');
const tripInfo = document.getElementById('trip-info');
const editTripBtn = document.getElementById('edit-trip-btn');
const editTripModal = document.getElementById('edit-trip-modal');
const closeEditModal = document.getElementById('close-edit-modal');
const editTripForm = document.getElementById('edit-trip-form');
const editDestination = document.getElementById('edit-destination');
const editDays = document.getElementById('edit-days');
const editPeople = document.getElementById('edit-people');
const totalCostPerPerson = document.getElementById('total-cost-per-person');
const editBudgetBtn = document.getElementById('edit-budget-btn');
const budgetModal = document.getElementById('budget-modal');
const closeBudgetModal = document.getElementById('close-budget-modal');
const budgetForm = document.getElementById('budget-form');
const totalBudgetDisplay = document.getElementById('total-budget');

// 🚀 Open Edit Trip Modal
editTripBtn.addEventListener('click', () => {
    console.log('✏️ Editing Trip Details');
    const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};
    editDestination.value = tripDetails.destination || '';
    editDays.value = tripDetails.days || 1;
    editPeople.value = tripDetails.people || 1;
    editTripModal.style.display = 'flex';
});

// ❌ Close Edit Trip Modal
closeEditModal.addEventListener('click', () => {
    editTripModal.style.display = 'none';
    console.log('❌ Edit Trip Modal Closed');
});

// ❌ Close Edit Trip Modal on Outside Click
window.addEventListener('click', (e) => {
  if (e.target === editTripModal) {
      editTripModal.style.display = 'none';
      console.log('❌ Edit Trip Modal Closed by clicking outside');
  }
});

// ✅ Save Edited Trip Details
editTripForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newDestination = editDestination.value.trim();
    const newDays = parseInt(editDays.value, 10);
    const newPeople = parseInt(editPeople.value, 10);

    if (!newDestination || newDays <= 0 || newPeople <= 0) {
        alert('❌ Please provide valid trip details.');
        return;
    }

    let tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};

    // Update Trip Details
    tripDetails.destination = newDestination;
    tripDetails.days = newDays;
    tripDetails.people = newPeople;

    // Trim Extra Days from Day Plans
    if (tripDetails.dayPlans) {
        const updatedDayPlans = {};
        for (let i = 1; i <= newDays; i++) {
            if (tripDetails.dayPlans[i]) {
                updatedDayPlans[i] = tripDetails.dayPlans[i];
            }
        }
        tripDetails.dayPlans = updatedDayPlans;
    }

    // Save Updates to LocalStorage
    localStorage.setItem('tripDetails', JSON.stringify(tripDetails));

    // Refresh Page Sections
    loadTripDetails();
    loadTripDays();
    calculateTotalCost();

    // Close Modal
    editTripModal.style.display = 'none';
    console.log('✅ Trip Details Updated Successfully');
});


// 🚀 Load Trip Details on Page Load
document.addEventListener('DOMContentLoaded', () => {
  loadTripDetails();
  loadTripDays();
  calculateTotalCost();
});

// 🛠️ Load Trip Details
function loadTripDetails() {
  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};

  const destination = tripDetails.destination || 'Unknown Destination';
  const days = tripDetails.days || 0;
  const people = tripDetails.people || 1;

  tripInfo.textContent = `Destination: ${destination} | Days: ${days} | Travelers: ${people}`;
}

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

      const dayPlan = tripDetails.dayPlans?.[i];

      if (dayPlan && dayPlan.dayPlan && dayPlan.dayPlan.length > 0) {
          // Day has activities planned
          let activitiesList = '<ul>';
          dayPlan.dayPlan.forEach(activity => {
              activitiesList += `<li>${activity.title}</li>`;
          });
          activitiesList += '</ul>';

          dayBlock.innerHTML = `
              <h3>Day ${i}</h3>
              <p><strong>Activities:</strong></p>
              ${activitiesList}
              <p><strong>Total Cost:</strong> $${dayPlan.totalCost.toFixed(2)}</p>
              <div class="day-buttons">
                  <button onclick="goToDay(${i})">📝 Edit Day Plan</button>
                  <button onclick="showDayDetails(${i})">🔍 Show Details</button>
              </div>
          `;
      } else {
          // Day has no activities planned
          dayBlock.innerHTML = `
              <h3>Day ${i}</h3>
              <p>No activities planned yet.</p>
              <div class="day-buttons">
                  <button onclick="goToDay(${i})">🕒 Plan This Day</button>
              </div>
          `;
      }

      daysGrid.appendChild(dayBlock);
  }
}

// Placeholder Function for Show Details
function showDayDetails(dayNumber) {
  console.log(`🔍 Show details for Day ${dayNumber}`);
  alert(`Show details functionality for Day ${dayNumber} will be implemented soon!`);
}


// 🛡️ Load Initial Budget
function loadBudget() {
  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};
  const budget = tripDetails.budget || 0;
  totalBudgetDisplay.textContent = budget.toFixed(2);
  console.log('💰 Budget Loaded:', budget);
}

// 📦 Open Budget Modal
editBudgetBtn.addEventListener('click', () => {
  console.log('📝 Opening Budget Modal...');
  budgetModal.style.display = 'flex';
});

// ❌ Close Budget Modal
closeBudgetModal.addEventListener('click', () => {
  console.log('❌ Closing Budget Modal...');
  budgetModal.style.display = 'none';
});

// 📥 Save Budget
budgetForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newBudget = parseFloat(document.getElementById('budget-input').value);

  if (isNaN(newBudget) || newBudget < 0) {
      alert('❌ Please enter a valid budget amount.');
      return;
  }

  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};
  tripDetails.budget = newBudget;

  localStorage.setItem('tripDetails', JSON.stringify(tripDetails));
  totalBudgetDisplay.textContent = newBudget.toFixed(2);

  console.log('✅ Budget Updated:', newBudget);
  budgetModal.style.display = 'none';
});

// 🚀 Initialize Budget on Load
document.addEventListener('DOMContentLoaded', () => {
  loadBudget();
});

// 💰 Calculate Total Trip Cost
function calculateTotalCost() {
  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};
  let totalCost = 0;

  if (tripDetails.dayPlans) {
    for (const day in tripDetails.dayPlans) {
      totalCost += tripDetails.dayPlans[day].totalCost || 0;
    }
  }

  totalCostPerPerson.textContent = totalCost.toFixed(2);
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
  const activities = JSON.parse(localStorage.getItem('activities')) || [];
  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};

  const exportData = {
    tripDetails,
    activities
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'trip-data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  console.log('📤 Trip Data Exported:', exportData);
});

// 📥 Handle Import Trip Data
function handleTripImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const tripData = JSON.parse(e.target.result);
      localStorage.setItem('tripDetails', JSON.stringify(tripData.tripDetails));
      localStorage.setItem('activities', JSON.stringify(tripData.activities));

      alert('✅ Trip data imported successfully!');
      loadTripDetails();
      loadTripDays();
      calculateTotalCost();
    } catch (err) {
      alert('❌ Invalid file format. Please upload a valid JSON file.');
    }
  };
  reader.readAsText(file);
}

// 📅 Navigate to Calendar Page for a Specific Day
function goToDay(dayNumber) {
  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};
  const dayDetails = tripDetails.dayPlans?.[dayNumber] || null;

  if (dayDetails) {
      localStorage.setItem('currentDayPlan', JSON.stringify(dayDetails));
      console.log(`📥 Loaded Day ${dayNumber} Plan:`, dayDetails);
  } else {
      localStorage.removeItem('currentDayPlan');
      console.warn(`⚠️ No plan found for Day ${dayNumber}. Clearing currentDayPlan.`);
  }

  localStorage.setItem('selectedDay', dayNumber);
  console.log(`📅 Selected Day Set: Day ${dayNumber}`);
  window.location.href = 'calendar.html';
}




