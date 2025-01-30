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
const budgetForm = document.getElementById('budget-form');
const totalBudgetDisplay = document.getElementById('total-budget');
const closeBudgetModal = document.getElementById('close-budget-modal');
/*const totalBudgetAllTravelersDisplay = document.getElementById('total-budget-all-travelers');*/

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

// 📌 Additional Expenses DOM Elements
const additionalExpensesList = document.getElementById('additional-expenses-list');
const additionalExpensesTotal = document.getElementById('additional-expenses-total');
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseModal = document.getElementById('expense-modal');
const expenseForm = document.getElementById('expense-form');
const expenseTitle = document.getElementById('expense-title');
const expenseCost = document.getElementById('expense-cost');
const saveExpenseBtn = document.getElementById('save-expense-btn');
const deleteExpenseBtn = document.getElementById('delete-expense-btn');
const closeExpenseModal = document.getElementById('close-expense-modal');

// ✅ To-Do List DOM Elements
const todoListContainer = document.getElementById('todo-list');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoModal = document.getElementById('todo-modal');
const todoForm = document.getElementById('todo-form');
const todoTitle = document.getElementById('todo-title');
const saveTodoBtn = document.getElementById('save-todo-btn');
const deleteTodoBtn = document.getElementById('delete-todo-btn');
const closeTodoModal = document.getElementById('close-todo-modal');


// 🚀 Initialize Sections
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM Loaded: Initializing trip details...');
  refreshDayPlanActivities();
  displayExpenses();
  loadTripDetails();
  loadTripDays();
  loadBudget();
  displayFlights();
  displayStays();
  displayTodoList();
  calculateTotalCost();
});

// 📌 DOM Elements for Edit Modal
const editDestinationInput = document.getElementById('edit-destination');
const editDestinationSuggestions = document.getElementById('edit-destination-suggestions');

// 🌍 OpenCage API Key
const API_KEY = 'f71bc728a85d40a692e5d5d7b62bd559';
const API_URL = 'https://api.opencagedata.com/geocode/v1/json';

// 🚀 Fetch Location Suggestions for Edit Modal
async function fetchEditLocationSuggestions(query) {
    if (!query || query.length < 3) {
        console.warn('⚠️ Query is too short for API request:', query);
        editDestinationSuggestions.innerHTML = '<li>Type at least 3 characters...</li>';
        return;
    }

    editDestinationSuggestions.innerHTML = '<li>Loading suggestions...</li>';

    try {
        const response = await fetch(
            `${API_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}&limit=5`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch location suggestions');
        }

        const data = await response.json();
        console.log('📦 OpenCage API Response (Edit Modal):', data);
        displayEditSuggestions(data.results);
    } catch (error) {
        console.error('❌ Error fetching suggestions (Edit Modal):', error);
        editDestinationSuggestions.innerHTML = '<li>Failed to fetch suggestions. Try again later.</li>';
    }
}

// 🚀 Debounce Function
function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// 🚀 Event Listener with Debounce
if (editDestinationInput) {
    editDestinationInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim();
        fetchEditLocationSuggestions(query);
    }, 300)); // 300ms delay
}

// 📋 Display Suggestions in Edit Modal
function displayEditSuggestions(suggestions) {
    editDestinationSuggestions.innerHTML = '';

    if (!suggestions.length) {
        editDestinationSuggestions.innerHTML = '<li>No results found</li>';
        return;
    }

    suggestions.forEach(suggestion => {
        const placeName = suggestion.formatted;
        const li = document.createElement('li');
        li.textContent = placeName;
        li.addEventListener('click', () => selectEditSuggestion(placeName));
        editDestinationSuggestions.appendChild(li);
    });
}

// ✅ Select Suggestion in Edit Modal
function selectEditSuggestion(placeName) {
    editDestinationInput.value = placeName;
    editDestinationSuggestions.innerHTML = '';
}

// ❌ Close Dropdown on Outside Click in Edit Modal
document.addEventListener('click', (e) => {
    if (!editDestinationInput.contains(e.target) && !editDestinationSuggestions.contains(e.target)) {
        editDestinationSuggestions.innerHTML = '';
    }
});



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
  calculateTotalCost();
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

  // Update tripDetails in localStorage
  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};
  tripDetails.stayTotalCost = totalCost;
  localStorage.setItem('tripDetails', JSON.stringify(tripDetails));

  console.log('💰 Stay Total Cost Updated:', totalCost);

  // Add Edit/Delete Button Listeners
  document.querySelectorAll('.edit-stay-btn').forEach(button => {
      button.addEventListener('click', (e) => {
          const index = e.target.dataset.index;
          openStayModal(true, index);
      });
  });
}


// 🚀 Initialize Add Stay Button
addStayBtn.addEventListener('click', () => openStayModal(false));










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

  // Recalculate Day Plans Total Cost for All Travelers
  if (tripDetails.dayPlans) {
      console.log('🔄 Updating day plans to match new number of travelers...');
      for (const day in tripDetails.dayPlans) {
          const dayPlan = tripDetails.dayPlans[day];
          const totalCostPerPerson = dayPlan.dayPlan?.reduce((sum, activity) => sum + activity.cost, 0) || 0;
          tripDetails.dayPlans[day].totalCost = totalCostPerPerson * newPeople;

          console.log(
              `✅ Day ${day} total recalculated: Per Person $${totalCostPerPerson}, Total (All Travelers): $${tripDetails.dayPlans[day].totalCost}`
          );
      }
  }

  // Save Updates to LocalStorage
  localStorage.setItem('tripDetails', JSON.stringify(tripDetails));

  // Refresh Page Sections
  loadTripDetails();
  loadTripDays();
  calculateTotalCost();

  // Close Modal
  editTripModal.style.display = 'none';
  console.log('✅ Trip Details and Day Plans Updated Successfully');
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
          const totalCostForAllTravelers = dayPlan.totalCost || 0;

          let activitiesList = '<ul>';
          dayPlan.dayPlan.forEach(activity => {
              activitiesList += `<li>${activity.title} - $${activity.cost.toFixed(2)}</li>`;
          });
          activitiesList += '</ul>';

          dayBlock.innerHTML = `
              <h3>Day ${i}</h3>
              <p><strong>Activities:</strong></p>
              ${activitiesList}
              <p><strong>Total Cost (All Travelers):</strong> $${totalCostForAllTravelers.toFixed(2)}</p>
              <div class="day-buttons">
                  <button onclick="goToDay(${i})">📝 Edit Day Plan</button>
              </div>
          `;
      } else {
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

  console.log('✅ Day Plans Loaded Successfully');
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


// ❌ Close Budget Modal on X Button Click
closeBudgetModal.addEventListener('click', () => {
  console.log('❌ Closing Budget Modal via Close Button');
  budgetModal.style.display = 'none';
});

// ❌ Close Budget Modal on Outside Click
window.addEventListener('click', (e) => {
  if (e.target === budgetModal) {
      console.log('❌ Closing Budget Modal via Outside Click');
      budgetModal.style.display = 'none';
  }
});



// 📥 Save Budget
budgetForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newBudget = parseFloat(document.getElementById('budget-input').value);

  // 🛡️ Validate Budget Input
  if (isNaN(newBudget) || newBudget < 0) {
    alert('❌ Please enter a valid budget amount.');
    return;
  }

  // 📦 Update LocalStorage
  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};
  tripDetails.budget = newBudget;

  const numberOfTravelers = parseInt(tripDetails.people) || 1;

  // 🧮 Dynamically Calculate Budget for All Travelers
  tripDetails.totalBudgetPerPerson = parseFloat(newBudget).toFixed(2);
  tripDetails.totalBudgetAllTravelers = (newBudget * numberOfTravelers).toFixed(2);

  // Save Updated Trip Details
  localStorage.setItem('tripDetails', JSON.stringify(tripDetails));

  // 🖥️ Update UI
  totalBudgetDisplay.textContent = newBudget.toFixed(2);
  document.getElementById('total-budget').textContent = `$${tripDetails.totalBudgetPerPerson}`;
  document.getElementById('total-budget-all-travelers').textContent = `$${tripDetails.totalBudgetAllTravelers}`;

  console.log('✅ Budget Updated Successfully:', {
    newBudget,
    totalBudgetPerPerson: tripDetails.totalBudgetPerPerson,
    totalBudgetAllTravelers: tripDetails.totalBudgetAllTravelers,
  });

  // 🧠 Recalculate Total Costs
  calculateTotalCost();

  // Close Modal
  budgetModal.style.display = 'none';
});




// 💰 Calculate Total Trip Cost
function calculateTotalCost() {
  console.log('🔄 Starting Total Trip Cost Calculation...');

  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};
  const numberOfTravelers = parseInt(tripDetails.people) || 1;

  let totalFlightsCost = parseFloat(tripDetails.flightsTotalCost || 0);
  let totalStayCost = parseFloat(tripDetails.stayTotalCost || 0);
  let totalDayPlansCost = 0;
  let totalAdditionalExpenses = additionalExpenses.reduce((sum, expense) => sum + expense.cost, 0);

  if (tripDetails.dayPlans) {
      console.log('📅 Calculating Total Day Plans Cost...');
      Object.keys(tripDetails.dayPlans).forEach(day => {
          const dayPlan = tripDetails.dayPlans[day];
          totalDayPlansCost += parseFloat(dayPlan?.totalCost || 0);
      });
  }

  const totalCostAllTravelers = totalFlightsCost + totalStayCost + totalDayPlansCost + totalAdditionalExpenses;
  const totalCostPerPerson = (totalCostAllTravelers / numberOfTravelers).toFixed(2);

  const totalBudgetPerPerson = parseFloat(tripDetails.budget || 0).toFixed(2);
  const totalBudgetAllTravelers = (parseFloat(totalBudgetPerPerson) * numberOfTravelers).toFixed(2);

  tripDetails.totalFlightsCost = totalFlightsCost;
  tripDetails.totalStayCost = totalStayCost;
  tripDetails.totalDayPlansCost = totalDayPlansCost;
  tripDetails.totalAdditionalExpenses = totalAdditionalExpenses;
  tripDetails.totalCostAllTravelers = parseFloat(totalCostAllTravelers.toFixed(2));
  tripDetails.totalCostPerPerson = parseFloat(totalCostPerPerson);
  tripDetails.totalBudgetPerPerson = parseFloat(totalBudgetPerPerson);
  tripDetails.totalBudgetAllTravelers = parseFloat(totalBudgetAllTravelers);

  localStorage.setItem('tripDetails', JSON.stringify(tripDetails));

  // Update UI
  document.getElementById('total-cost-all-travelers').textContent = `$${totalCostAllTravelers.toFixed(2)}`;
  document.getElementById('total-cost-per-person').textContent = `$${totalCostPerPerson}`;
  document.getElementById('total-budget').textContent = `$${totalBudgetPerPerson}`;
  document.getElementById('total-budget-all-travelers').textContent = `$${totalBudgetAllTravelers}`;

  console.log('✅ Total Trip Cost Calculated Successfully:', {
      totalFlightsCost,
      totalStayCost,
      totalDayPlansCost,
      totalAdditionalExpenses,
      totalCostAllTravelers,
      totalCostPerPerson,
      totalBudgetPerPerson,
      totalBudgetAllTravelers
  });
}


// 🏠 Navigate Back to Home Page
goBackBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// 📋 Navigate to Activities Page
manageActivitiesBtn.addEventListener('click', () => {
  window.location.href = 'activities.html';
});







// 📤 Export Trip Data as JSON
function exportTripData() {
  console.log("📤 Exporting trip data...");

  const tripData = {
      tripDetails: JSON.parse(localStorage.getItem("tripDetails")) || {},
      flights: JSON.parse(localStorage.getItem("flights")) || [],
      stays: JSON.parse(localStorage.getItem("stays")) || [],
      dayPlans: JSON.parse(localStorage.getItem("dayPlans")) || {},
      activities: JSON.parse(localStorage.getItem("activities")) || [],
      additionalExpenses: JSON.parse(localStorage.getItem("additionalExpenses")) || [],
      todoList: JSON.parse(localStorage.getItem("todoList")) || []
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tripData, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "trip-plan.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);

  console.log("✅ Trip data exported successfully.");
}

// 📤 Attach Export Button Event Listener
if (exportTripBtn) {
  exportTripBtn.addEventListener("click", exportTripData);
}


// 📥 Import Trip Data from JSON File
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

          // ✅ Validate JSON structure
          if (!tripData.tripDetails || !tripData.dayPlans || !tripData.activities) {
              throw new Error("Invalid trip data format.");
          }

          console.log("📥 Valid Trip Data Loaded:", tripData);

          // 📝 Store everything in localStorage
          localStorage.setItem("tripDetails", JSON.stringify(tripData.tripDetails));
          localStorage.setItem("flights", JSON.stringify(tripData.flights || []));
          localStorage.setItem("stays", JSON.stringify(tripData.stays || []));
          localStorage.setItem("dayPlans", JSON.stringify(tripData.dayPlans || {}));
          localStorage.setItem("activities", JSON.stringify(tripData.activities || []));
          localStorage.setItem("additionalExpenses", JSON.stringify(tripData.additionalExpenses || []));
          localStorage.setItem("todoList", JSON.stringify(tripData.todoList || []));

          console.log("✅ Trip data imported and saved in localStorage.");

          // 🔄 Redirect to trip page after import (for index.html)
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

const importTripBtnTrip = document.getElementById("import-trip-btn");
const importTripInputTrip = document.getElementById("import-trip-input-trip");

if (importTripBtnTrip && importTripInputTrip) {
    importTripBtnTrip.addEventListener("click", () => importTripInputTrip.click());
    importTripInputTrip.addEventListener("change", (event) => importTripData(event, false));
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

  calculateTotalCost();

  // ✅ Properly Reset and Close Modal
  flightsForm.reset();
  flightsModal.style.display = 'none';
  editingFlightIndex = null;

  console.log('✅ Flight Form Handling Complete');
});


// 📝 Display Flights with Edit/Delete Button
function displayFlights() {
  flightsList.innerHTML = '';
  let totalCost = 0;

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

  // Update tripDetails in localStorage
  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};
  tripDetails.flightsTotalCost = totalCost;
  localStorage.setItem('tripDetails', JSON.stringify(tripDetails));

  console.log('💰 Flights Total Cost Updated:', totalCost);

  // Add Edit/Delete Button Listeners
  document.querySelectorAll('.edit-flight-btn').forEach(button => {
      button.addEventListener('click', (e) => {
          const index = e.target.dataset.index;
          openFlightModal(true, index);
      });
  });
}


// 🚀 Initialize Add Flight Button
addFlightsBtn.addEventListener('click', () => openFlightModal(false));




document.querySelectorAll('.edit-flight-btn').forEach(button => {
  button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      openFlightModal(true, index);
  });
});

document.querySelectorAll('.edit-stay-btn').forEach(button => {
  button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      openStayModal(true, index);
  });
});






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









let additionalExpenses = JSON.parse(localStorage.getItem('additionalExpenses')) || [];
let editingExpenseIndex = null;

// 🚀 Display Expenses
function displayExpenses() {
  additionalExpensesList.innerHTML = '';
  let total = 0;

  additionalExpenses = additionalExpenses.filter(expense => expense.title && !isNaN(expense.cost) && expense.cost >= 0);

  additionalExpenses.forEach((expense, index) => {
    total += expense.cost;

    const li = document.createElement('li');
    li.innerHTML = `
      ${expense.title}: $${expense.cost.toFixed(2)}
      <button class="edit-expense-btn" data-index="${index}">✏️ Edit/Delete</button>
    `;
    additionalExpensesList.appendChild(li);
  });

  additionalExpensesTotal.textContent = total.toFixed(2);

  // Save cleaned-up expenses to localStorage
  localStorage.setItem('additionalExpenses', JSON.stringify(additionalExpenses));
  console.log('💾 Additional Expenses saved to localStorage:', additionalExpenses);

  // Add Edit/Delete Button Listeners
  document.querySelectorAll('.edit-expense-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      editingExpenseIndex = e.target.dataset.index;
      openExpenseModal(true, editingExpenseIndex);
    });
  });

  calculateTotalCost();
}



expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = expenseTitle.value.trim();
  const cost = parseFloat(expenseCost.value);

  // 🛡️ Validation
  if (!title || isNaN(cost) || cost < 0) {
    alert('❌ Please enter valid expense details.');
    return;
  }

  if (editingExpenseIndex !== null) {
    // Editing an existing expense
    additionalExpenses[editingExpenseIndex] = { title, cost };
    console.log(`✅ Expense Edited at Index ${editingExpenseIndex}:`, { title, cost });
    editingExpenseIndex = null;
  } else {
    // Adding a new expense
    additionalExpenses.push({ title, cost });
    console.log('✅ New Expense Added:', { title, cost });
  }

  // Save to localStorage and update UI
  localStorage.setItem('additionalExpenses', JSON.stringify(additionalExpenses));
  displayExpenses();
  calculateTotalCost();

  expenseModal.style.display = 'none';
  expenseForm.reset();
});




// 🚀 Initialize Add Expense Button
document.getElementById('add-expense-btn').addEventListener('click', () => openExpenseModal(false));


// 🚀 Open Expense Modal
function openExpenseModal(isEdit = false, index = null) {
    const modalTitle = document.getElementById('expense-modal-title');
    const saveBtn = document.getElementById('save-expense-btn');
    const deleteBtn = document.getElementById('delete-expense-btn');

    if (isEdit) {
        modalTitle.textContent = 'Edit Expense';
        saveBtn.textContent = 'Save Changes';
        deleteBtn.style.display = 'inline-block';

        const expense = additionalExpenses[index];
        document.getElementById('expense-title').value = expense.title;
        document.getElementById('expense-cost').value = expense.cost;
    } else {
        modalTitle.textContent = 'Add Expense';
        saveBtn.textContent = 'Add Expense';
        deleteBtn.style.display = 'none';
        document.getElementById('expense-form').reset();
    }

    document.getElementById('expense-modal').style.display = 'flex';
}

// 🚀 Save or Edit Expense
document.getElementById('expense-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('expense-title').value.trim();
    const cost = parseFloat(document.getElementById('expense-cost').value);

    if (editingExpenseIndex !== null) {
        additionalExpenses[editingExpenseIndex] = { title, cost };
        editingExpenseIndex = null;
    } else {
        additionalExpenses.push({ title, cost });
    }

    displayExpenses();
    document.getElementById('expense-modal').style.display = 'none';
});

// 🚀 Delete Expense
document.getElementById('delete-expense-btn').addEventListener('click', () => {
    if (editingExpenseIndex !== null) {
        additionalExpenses.splice(editingExpenseIndex, 1);
        editingExpenseIndex = null;
        displayExpenses();
        document.getElementById('expense-modal').style.display = 'none';
    }
});

// 🚀 Reset Modal State for Expenses
document.getElementById('close-expense-modal').addEventListener('click', () => {
  document.getElementById('expense-modal').style.display = 'none';
  document.getElementById('expense-form').reset();
  editingExpenseIndex = null;
});







let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let editingTodoIndex = null;

// 🚀 Display To-Do List
function displayTodoList() {
  const todoListContainer = document.getElementById("todo-list");
  if (!todoListContainer) {
      console.warn("⚠️ To-Do List container not found in DOM.");
      return;
  }

  // ✅ Load the To-Do list from localStorage
  let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

  console.log("📥 Loaded To-Do List from localStorage:", todoList);

  // ✅ Clear previous list
  todoListContainer.innerHTML = '';

  // ✅ Handle empty To-Do list scenario
  if (todoList.length === 0) {
      todoListContainer.innerHTML = `<p>No to-dos yet.</p>`;
      return;
  }

  // ✅ Populate the list with To-Do items
  todoList.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
          <input type="checkbox" class="todo-checkbox" data-index="${index}" ${item.completed ? 'checked' : ''}>
          <span>${item.title}</span>
          <button class="edit-todo-btn" data-index="${index}">✏️ Edit/Delete</button>
      `;
      todoListContainer.appendChild(li);
  });

  // ✅ Add Event Listener for Checkboxes (Save Completion Status)
  document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
          let todoList = JSON.parse(localStorage.getItem("todoList")) || [];
          const index = e.target.dataset.index;
          todoList[index].completed = e.target.checked;

          // ✅ Save updated To-Do list to localStorage
          localStorage.setItem("todoList", JSON.stringify(todoList));

          console.log(`✅ To-Do ${index} checked state updated:`, todoList[index].completed);
      });
  });

  // ✅ Add Event Listener for Edit/Delete Buttons
  document.querySelectorAll('.edit-todo-btn').forEach(button => {
      button.addEventListener('click', (e) => {
          editingTodoIndex = e.target.dataset.index;
          openTodoModal(true, editingTodoIndex);
      });
  });
}




// 🚀 Initialize Add To-Do Button
document.getElementById('add-todo-btn').addEventListener('click', () => openTodoModal(false));


// 🚀 Open To-Do Modal
function openTodoModal(isEdit = false, index = null) {
  const modalTitle = document.getElementById('todo-modal-title');
  const saveBtn = document.getElementById('save-todo-btn');
  const deleteBtn = document.getElementById('delete-todo-btn');

  // ✅ Load the existing todoList from localStorage before opening modal
  let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

  if (isEdit) {
      modalTitle.textContent = 'Edit To-Do';
      saveBtn.textContent = 'Save Changes';
      deleteBtn.style.display = 'inline-block';

      // ✅ Make sure `index` is within bounds
      if (index !== null && todoList[index]) {
          document.getElementById('todo-title').value = todoList[index].title;
      }
  } else {
      modalTitle.textContent = 'Add To-Do';
      saveBtn.textContent = 'Add To-Do';
      deleteBtn.style.display = 'none';
      document.getElementById('todo-form').reset();
  }

  document.getElementById('todo-modal').style.display = 'flex';
}

// 🚀 Save To-Do
document.getElementById('todo-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('todo-title').value.trim();
  if (!title) {
      alert("❌ Please enter a valid To-Do title.");
      return;
  }

  // ✅ Retrieve and update the todoList from localStorage
  let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

  if (editingTodoIndex !== null) {
      // ✅ Editing an existing item
      todoList[editingTodoIndex].title = title;
      editingTodoIndex = null;
  } else {
      // ✅ Adding a new item
      todoList.push({ title, completed: false });
  }

  // ✅ Save updated todoList to localStorage
  localStorage.setItem("todoList", JSON.stringify(todoList));

  // ✅ Refresh the list in UI
  displayTodoList();

  // ✅ Close modal
  document.getElementById('todo-modal').style.display = 'none';
  document.getElementById('todo-form').reset();
});

// 🚀 Delete To-Do
document.getElementById('delete-todo-btn').addEventListener('click', () => {
  if (editingTodoIndex !== null) {
      let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

      // ✅ Remove the item
      todoList.splice(editingTodoIndex, 1);
      editingTodoIndex = null;

      // ✅ Save updated list to localStorage
      localStorage.setItem("todoList", JSON.stringify(todoList));

      // ✅ Refresh the list in UI
      displayTodoList();

      // ✅ Close modal
      document.getElementById('todo-modal').style.display = 'none';
  }
});

// 🚀 Reset Modal State for To-Do
document.getElementById('close-todo-modal').addEventListener('click', () => {
  document.getElementById('todo-modal').style.display = 'none';
  document.getElementById('todo-form').reset();
  editingTodoIndex = null;
});



function refreshDayPlanActivities() {
  console.log('🔄 Refreshing Day Plan Activities in Trip Overview');

  const activities = JSON.parse(localStorage.getItem('activities')) || [];
  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};

  if (tripDetails.dayPlans) {
      Object.keys(tripDetails.dayPlans).forEach(day => {
          let dayPlan = tripDetails.dayPlans[day];
          if (dayPlan.dayPlan) {
              dayPlan.dayPlan = dayPlan.dayPlan.map(activity => {
                  const updatedActivity = activities.find(act => act.id == activity.id);
                  if (updatedActivity) {
                      return {
                          ...activity,
                          title: updatedActivity.title,
                          cost: updatedActivity.cost
                      };
                  }
                  return activity;
              });
          }

          // 🧮 Recalculate total cost for the day
          const people = tripDetails.people || 1;
          const totalCostPerPerson = dayPlan.dayPlan.reduce((sum, activity) => sum + parseFloat(activity.cost || 0), 0);
          dayPlan.totalCost = totalCostPerPerson * people;
      });

      // Save updated day plans back to localStorage
      localStorage.setItem('tripDetails', JSON.stringify(tripDetails));
      console.log('✅ Day Plans updated with refreshed activity details and recalculated costs.');
  }
}



// Call this before rendering days
refreshDayPlanActivities();
loadTripDays();


