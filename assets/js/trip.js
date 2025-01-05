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

// ✈️ Flight DOM Elements
const flightsList = document.getElementById('flights-list'); // List container for flights
const flightsTotalCost = document.getElementById('flights-total-cost'); // Total cost display
const flightsModal = document.getElementById('flight-modal'); // Flight modal
const addFlightsBtn = document.getElementById('add-flight-btn'); // Add flight button
const flightModalTitle = document.getElementById('flight-modal-title');
const saveFlightBtn = document.getElementById('save-flight-btn');
const deleteFlightBtn = document.getElementById('delete-flight-btn');
const flightsForm = document.getElementById('flight-form');
const flightDeparture = document.getElementById('flight-departure');
const flightArrival = document.getElementById('flight-arrival');
const flightCost = document.getElementById('flight-cost');
const flightType = document.getElementById('flight-type');
const closeFlightModal = document.getElementById('close-flight-modal');


// 🏨 Stay DOM Elements
const stayList = document.getElementById('stay-list');
const stayTotalCost = document.getElementById('stay-total-cost');
const stayModal = document.getElementById('stay-modal');
const addStayBtn = document.getElementById('add-stay-btn');
const stayForm = document.getElementById('stay-form');
const stayName = document.getElementById('stay-name');
const stayLocation = document.getElementById('stay-location');
const stayNights = document.getElementById('stay-nights');
const stayCost = document.getElementById('stay-cost');
const closeStayModal = document.getElementById('close-stay-modal');
const saveStayBtn = document.getElementById('save-stay-btn');
const deleteStayBtn = document.getElementById('delete-stay-btn');
const stayModalTitle = document.getElementById('stay-modal-title');




// 🏨 Stay Data
let stays = JSON.parse(localStorage.getItem('stays')) || [];
let editingStayIndex = null;

// 🚀 Open Stay Modal for Adding/Editing
addStayBtn.addEventListener('click', () => {
  openStayModal(false);
});

closeStayModal.addEventListener('click', () => {
  stayModal.style.display = 'none';
  stayForm.reset();
  editingStayIndex = null;
});

// 🚀 Open Modal for Adding/Editing Stay
function openStayModal(isEdit = false, index = null) {
  console.log(`📝 Opening Stay Modal | isEdit: ${isEdit}, index: ${index}`);
  if (isEdit) {
    stayModalTitle.textContent = 'Edit Stay';
    saveStayBtn.textContent = 'Save Changes';
    deleteStayBtn.style.display = 'inline-block';

    const stay = stays[index];
    console.log('✏️ Editing Stay Details:', stay);

    stayName.value = stay.name;
    stayLocation.value = stay.location;
    stayNights.value = stay.nights;
    stayCost.value = stay.cost;

    editingStayIndex = index;
  } else {
    stayModalTitle.textContent = 'Add Stay';
    saveStayBtn.textContent = 'Add Stay';
    deleteStayBtn.style.display = 'none';

    stayForm.reset();
    editingStayIndex = null;
  }

  stayModal.style.display = 'flex';
}

// 🚀 Close Stay Modal
function closeStayModalHandler() {
  console.log('❌ Closing Stay Modal');
  stayModal.style.display = 'none';
  stayForm.reset();
  editingStayIndex = null;
}

// ✅ Handle Add/Edit Stay
stayForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('🏨 Stay Form Submitted');

  const name = stayName.value.trim();
  const location = stayLocation.value.trim();
  const nights = parseInt(stayNights.value, 10);
  const cost = parseFloat(stayCost.value);

  console.log('📝 Stay Details:', { name, location, nights, cost });

  if (!name || !location || isNaN(nights) || nights <= 0 || isNaN(cost) || cost < 0) {
    alert('❌ Please enter valid stay details.');
    return;
  }

  if (editingStayIndex !== null) {
    console.log(`🛠️ Editing Existing Stay at Index: ${editingStayIndex}`);
    stays[editingStayIndex] = {
      ...stays[editingStayIndex],
      name,
      location,
      nights,
      cost,
    };
    console.log('✅ Stay Updated:', stays[editingStayIndex]);
  } else {
    console.log('🚀 Adding New Stay');
    const newStay = {
      id: Date.now(),
      name,
      location,
      nights,
      cost,
    };
    stays.push(newStay);
    console.log('✅ New Stay Added:', newStay);
  }

  // Save to localStorage
  localStorage.setItem('stays', JSON.stringify(stays));
  console.log('💾 Stays saved to localStorage:', stays);

  // Update UI and close modal
  displayStays();
  closeStayModalHandler();
});

// 🗑️ Handle Stay Deletion
deleteStayBtn.addEventListener('click', () => {
  if (editingStayIndex !== null) {
    console.log(`🗑️ Deleting Stay at Index: ${editingStayIndex}`);
    stays.splice(editingStayIndex, 1);

    localStorage.setItem('stays', JSON.stringify(stays));
    console.log('💾 Stays updated in localStorage after removal.');
    displayStays();
    closeStayModalHandler();
  }
});

// 🚀 Display Stays
function displayStays() {
  const stayList = document.getElementById('stay-list');
  const stayTotalCost = document.getElementById('stay-total-cost');

  stayList.innerHTML = '';
  let totalCost = 0;

  stays.forEach((stay, index) => {
    totalCost += stay.cost;

    const stayItem = document.createElement('li');
    stayItem.innerHTML = `
      ${stay.name}, ${stay.location}, ${stay.nights} nights, Cost: $${stay.cost.toFixed(2)}
      <button class="edit-stay-btn" data-index="${index}">✏️ Edit/Delete</button>
    `;
    stayList.appendChild(stayItem);
  });

  stayTotalCost.textContent = totalCost.toFixed(2);
  console.log('💰 Stay Total Cost:', totalCost);

  // Add event listener for Edit/Delete
  const editButtons = document.querySelectorAll('.edit-stay-btn');
  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      console.log('📝 Edit/Delete Clicked for Stay Index:', index);
      openStayModal(true, index);
    });
  });

  // Update total trip cost if needed
  calculateTotalCost();
}

// 💰 Update Total Cost
function updateTotalCost() {
  let flightCost = flights.reduce((sum, flight) => sum + flight.cost, 0);
  let stayCost = stays.reduce((sum, stay) => sum + stay.cost, 0);
  let activityCost = dayPlan.reduce((sum, activity) => sum + activity.cost, 0);

  const totalCost = flightCost + stayCost + activityCost;
  document.getElementById('total-cost-per-person').textContent = totalCost.toFixed(2);
}

// 🚀 Initialize Stay Section
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔄 DOM Content Loaded - Initializing Stay Section');
  displayStays();
  updateTotalCost();
});


// Track currently edited flight index
let editingFlightIndex = null;


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

// 📦 Open Budget Modal and Load Current Budget
editBudgetBtn.addEventListener('click', () => {
  console.log('📝 Opening Budget Modal...');

  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};
  const currentBudget = tripDetails.budget || 0;

  // Set the current budget in the modal input
  document.getElementById('budget-input').value = currentBudget;

  console.log('💰 Loaded Budget into Modal:', currentBudget);

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

// 💰 Calculate and Display Total Trip Cost (Including Flights)
function calculateTotalCost() {
  console.log('🔄 Calculating Total Trip Cost...');

  let totalCost = 0;

  // 🗓️ Add costs from Day Plans
  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};
  if (tripDetails.dayPlans) {
      for (const day in tripDetails.dayPlans) {
          totalCost += tripDetails.dayPlans[day].totalCost || 0;
      }
  }

  console.log('🛠️ Day Plans Total Cost:', totalCost);

  // ✈️ Add costs from Flights
  const flights = JSON.parse(localStorage.getItem('flights')) || [];
  const flightsTotalCost = flights.reduce((sum, flight) => sum + flight.cost, 0);
  totalCost += flightsTotalCost;

  // ✅ Add Stays Total Cost
  const stays = JSON.parse(localStorage.getItem('stays')) || [];
  const staysTotalCost = stays.reduce((sum, stay) => sum + stay.cost, 0);
  totalCost += staysTotalCost;

  // 📝 Update DOM
  totalCostPerPerson.textContent = totalCost.toFixed(2);

  // Save updated cost back to tripDetails for consistency
  tripDetails.totalCost = totalCost;
  localStorage.setItem('tripDetails', JSON.stringify(tripDetails));
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
  const flights = JSON.parse(localStorage.getItem('flights')) || [];
  const stays = JSON.parse(localStorage.getItem('stays')) || [];

  const exportData = {
    tripDetails,
    activities,
    flights,
    stays,
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


function handleTripImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const tripData = JSON.parse(e.target.result);

      // ✅ Ensure each section is initialized if missing
      const defaultTripDetails = { destination: '', days: 0, people: 1, dayPlans: {} };
      const defaultActivities = [];
      const defaultFlights = [];
      const defaultStays = [];

      localStorage.setItem('tripDetails', JSON.stringify(tripData.tripDetails || defaultTripDetails));
      localStorage.setItem('activities', JSON.stringify(tripData.activities || defaultActivities));
      localStorage.setItem('flights', JSON.stringify(tripData.flights || defaultFlights));
      localStorage.setItem('stays', JSON.stringify(tripData.stays || defaultStays));

      alert('✅ Trip data imported successfully!');
      console.log('📥 Trip Data Imported:', tripData);

      // Reload relevant sections
      loadTripDetails();
      loadTripDays();
      calculateTotalCost();
      displayFlights(); // Ensure flights are reloaded
      displayStays();   // Ensure stays are reloaded
    } catch (err) {
      console.error('❌ Error importing trip data:', err);
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




// ✈️ Flight Data
let flights = JSON.parse(localStorage.getItem('flights')) || [];
console.log('✈️ Loaded Flights from localStorage:', flights);

// 🚀 Show Flights Modal for Adding Flight
addFlightsBtn.addEventListener('click', () => {
  console.log('📝 Add Flights button clicked.');
  openFlightModal(false); // Open modal in "Add" mode
});


// ❌ Close Flights Modal
closeFlightModal.addEventListener('click', () => {
  console.log('❌ Flights Modal closed.');
  flightsModal.style.display = 'none';
  flightsForm.reset();
});

// ✅ Handle Add/Edit Flight (Single Event Listener)
flightsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('✈️ Flight Form Submitted');

  // 📝 Fetch Input Values
  const departure = flightDeparture.value.trim();
  const arrival = flightArrival.value.trim();
  const cost = parseFloat(flightCost.value);
  const tripType = flightType.value;

  console.log('📝 Flight Details:', { departure, arrival, cost, tripType });
  console.log('🛠️ Editing Flight Index:', editingFlightIndex);

  // 🛡️ Validation Logic
  if (!departure) {
      console.warn('❌ Invalid departure location:', departure);
      alert('❌ Please enter a valid departure location.');
      return;
  }

  if (!arrival) {
      console.warn('❌ Invalid arrival location:', arrival);
      alert('❌ Please enter a valid arrival location.');
      return;
  }

  if (isNaN(cost) || cost < 0) {
      console.warn('❌ Invalid flight cost:', cost);
      alert('❌ Please enter a valid flight cost.');
      return;
  }

  // 🚀 Add or Edit Flight Based on `editingFlightIndex`
  if (editingFlightIndex !== null && flights[editingFlightIndex]) {
      console.log(`🛠️ Editing Existing Flight at Index: ${editingFlightIndex}`);
      flights[editingFlightIndex] = {
          ...flights[editingFlightIndex],
          departure,
          arrival,
          cost,
          tripType,
      };
      console.log('✅ Flight Updated:', flights[editingFlightIndex]);
  } else {
      console.log('🚀 Adding New Flight');
      const newFlight = {
          id: Date.now(),
          departure,
          arrival,
          cost,
          tripType,
      };
      flights.push(newFlight);
      console.log('✅ New Flight Added:', newFlight);
  }

  // 💾 Save Flights to LocalStorage
  localStorage.setItem('flights', JSON.stringify(flights));
  console.log('💾 Flights saved to localStorage:', flights);

  // 📝 Refresh Display
  displayFlights();

  // ✅ Properly Reset and Close Modal
  flightsForm.reset();
  flightsModal.style.display = 'none';
  editingFlightIndex = null;

  console.log('✅ Flight Form Handling Complete');
});


// 📝 Display Flights with Edit/Delete Button
function displayFlights() {
  flightsList.innerHTML = ''; // Clear the flight list
  let totalCost = 0;

  console.log('🔄 Displaying Flights:', flights);

  flights.forEach((flight, index) => {
      totalCost += flight.cost;

      const flightItem = document.createElement('li');
      flightItem.innerHTML = `
          ${flight.departure} - ${flight.arrival}, ${flight.tripType}, Cost: $${flight.cost.toFixed(2)}
          <button class="edit-flight-btn" data-index="${index}">✏️ Edit/Delete</button>
      `;
      flightsList.appendChild(flightItem);
  });

  flightsTotalCost.textContent = totalCost.toFixed(2);
  console.log('💰 Flights Total Cost:', totalCost);

  // Add Edit/Delete Listeners
  const editButtons = document.querySelectorAll('.edit-flight-btn');
  editButtons.forEach(button => {
      button.addEventListener('click', (e) => {
          const index = e.target.dataset.index;
          console.log('📝 Edit/Delete Clicked for Flight Index:', index);
          openFlightModal(true, index);
      });
  });

  // 🔄 Immediately Recalculate Total Trip Cost
  calculateTotalCost();
  console.log('✅ Total Trip Cost recalculated after flight updates.');
}




// 🗑️ Remove Flight by Index
function removeFlight(index) {
  console.log(`🗑️ Removing Flight at Index: ${index}`);

  // Remove flight from the array
  flights.splice(index, 1);

  // Save the updated flights array to localStorage
  localStorage.setItem('flights', JSON.stringify(flights));
  console.log('💾 Flights updated in localStorage after removal.');

  // Refresh the flights list in the UI
  displayFlights();

  // 🔄 Recalculate the total cost immediately
  calculateTotalCost();
  console.log('✅ Total Trip Cost updated after flight removal');
}


// 🚀 Update Total Trip Cost (Including Flights)
function updateTotalTripCost() {
  let totalTripCost = 0;

  // Add cost from Day Plans
  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};
  if (tripDetails.dayPlans) {
      for (const day in tripDetails.dayPlans) {
          totalTripCost += tripDetails.dayPlans[day].totalCost || 0;
      }
  }

  // Add cost from Flights
  const totalFlightCost = flights.reduce((sum, flight) => sum + flight.cost, 0);
  totalTripCost += totalFlightCost;

  // Update Total Cost Display
  totalCostPerPerson.textContent = totalTripCost.toFixed(2);

  console.log('💵 Total Trip Cost Updated:', totalTripCost);
}


// 🚀 Initialize Flights on Page Load
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔄 DOM Content Loaded - Initializing Flights Section');
  console.log('✈️ Initial Flights Array:', flights);

  if (!flightsList) {
    console.error('❌ flightsList DOM element is not found during initialization.');
  }

  displayFlights();
});


// 🚀 Open Modal for Adding/Editing Flight
function openFlightModal(isEdit = false, index = null) {
  console.log(`📝 Opening Flight Modal | isEdit: ${isEdit}, index: ${index}`);
  if (isEdit) {
    flightModalTitle.textContent = 'Edit Flight';
    saveFlightBtn.textContent = 'Save Changes';
    deleteFlightBtn.style.display = 'inline-block';

    // Load existing flight details
    const flight = flights[index];
    console.log('✏️ Editing Flight Details:', flight);

    flightDeparture.value = flight.departure;
    flightArrival.value = flight.arrival;
    flightCost.value = flight.cost;
    flightType.value = flight.tripType;

    editingFlightIndex = index;
  } else {
    flightModalTitle.textContent = 'Add Flight';
    saveFlightBtn.textContent = 'Add Flight';
    deleteFlightBtn.style.display = 'none';

    flightsForm.reset();
    editingFlightIndex = null;
  }

  flightsModal.style.display = 'flex';
}

// 🚀 Close Modal
closeFlightModal.addEventListener('click', () => {
  console.log('❌ Closing Flight Modal');
  flightsModal.style.display = 'none';
  flightsForm.reset();
  editingFlightIndex = null;
});









// 🗑️ Handle Flight Deletion
deleteFlightBtn.addEventListener('click', () => {
  if (editingFlightIndex !== null) {
    flights.splice(editingFlightIndex, 1);
    console.log(`🗑️ Flight Deleted at Index: ${editingFlightIndex}`);

    localStorage.setItem('flights', JSON.stringify(flights));
    displayFlights();
    flightsModal.style.display = 'none';
    editingFlightIndex = null;
    flightsForm.reset();
  }
});




