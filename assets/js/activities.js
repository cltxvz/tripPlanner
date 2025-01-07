// 📌 DOM Elements
const activityForm = document.getElementById('activity-form');
const activityList = document.getElementById('activity-list');
const addActivityBtn = document.getElementById('add-activity-btn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const saveGoBackBtn = document.getElementById('save-go-back-btn');

// 🚀 Load Trip Details into Header
function loadTripDetailsInHeader() {
  const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};

  const destination = tripDetails.destination || 'Unknown Destination';
  const days = tripDetails.days || 0;
  const people = tripDetails.people || 1;

  const tripDetailsHeader = document.getElementById('trip-details-header');
  if (tripDetailsHeader) {
      tripDetailsHeader.textContent = `Destination: ${destination} | Days: ${days} | Travelers: ${people}`;
      console.log('📝 Trip Details Loaded into Header:', { destination, days, people });
  } else {
      console.warn('⚠️ Trip Details Header element not found in DOM.');
  }
}

// 📚 Activity Array
let activities = JSON.parse(localStorage.getItem('activities')) || [];
console.log('📦 Loaded Activities:', activities);


// 🛡️ Ensure Modal is Hidden on Page Load
window.addEventListener('DOMContentLoaded', () => {

  // 📝 Display Trip Details in Header
  loadTripDetailsInHeader();
  
    modal.style.display = 'none';
  });
  
// 🚀 Show Modal Function
function showModal(title = 'Add a New Activity') {
  document.querySelector('.modal-content h2').innerText = title;
  document.querySelector('#activity-form button').innerText = title.includes('Edit') ? 'Edit Activity' : 'Add Activity';

  modal.style.display = 'flex';
  modal.style.alignItems = 'center'; // Ensure vertical centering
  modal.style.justifyContent = 'center'; // Ensure horizontal centering
  modal.scrollTop = 0; // Reset scroll position
}


// Open Modal for Adding a New Activity
addActivityBtn.addEventListener('click', () => {
  activityForm.reset();
  delete activityForm.dataset.editingId;
  showModal('Add a New Activity');
});


// ❌ Close Modal
function closeModalHandler() {
  modal.style.display = 'none';
  activityForm.reset();
  delete activityForm.dataset.editingId;
}

// Close Modal Button
closeModal.addEventListener('click', closeModalHandler);

// Close Modal on Outside Click
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModalHandler();
  }
});


// 🚀 Save and Go Back to Trip Page
saveGoBackBtn.addEventListener('click', () => {
  console.log('💾 Saving Activities and Redirecting to Trip Page');

  // Ensure activities are saved to localStorage
  saveActivities();

  // Redirect to trip.html
  window.location.href = 'trip.html';
});

// 🛠️ Add or Edit Activity
activityForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('activity-title').value.trim();
  const description = document.getElementById('activity-description').value.trim();
  const cost = parseFloat(document.getElementById('activity-cost').value) || 0;

  if (!title || isNaN(cost) || cost < 0) {
    alert('❌ Please provide a valid title and cost.');
    return;
  }

  const editingId = activityForm.dataset.editingId;

  if (editingId) {
    // Edit existing activity
    const activity = activities.find(a => a.id === parseInt(editingId));
    if (activity) {
      activity.title = title;
      activity.description = description;
      activity.cost = cost;
    }
    delete activityForm.dataset.editingId;
    console.log('✏️ Activity Edited:', activity);
  } else {
    // Add new activity
    const newActivity = {
      id: Date.now(),
      title,
      description,
      cost,
    };
    activities.push(newActivity);
    console.log('➕ New Activity Added:', newActivity);
  }

  saveActivities();
  displayActivities();
  activityForm.reset();
  closeModalHandler();
});


// 📋 Display Activities
function displayActivities() {
  activityList.innerHTML = ''; // Clear list before repopulating

  activities.forEach((activity, index) => {
    const activityItem = document.createElement('li');
    activityItem.innerHTML = `
      <strong>${activity.title}</strong> 
      ${activity.description ? `<p>${activity.description}</p>` : ''}
      Cost Per Person: $${activity.cost.toFixed(2)}
      <button class="edit-activity-btn" data-index="${index}">✏️ Edit/Delete</button>
    `;
    activityList.appendChild(activityItem);
  });

  // Add Edit/Delete Listeners
  document.querySelectorAll('.edit-activity-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      openActivityModal(true, index);
    });
  });
}



function openActivityModal(isEdit = false, index = null) {
  const modalTitle = document.getElementById('activity-modal-title');
  const saveActivityBtn = document.getElementById('save-activity-btn');
  const deleteActivityBtn = document.getElementById('delete-activity-btn');
  const activityTitle = document.getElementById('activity-title');
  const activityDescription = document.getElementById('activity-description');
  const activityCost = document.getElementById('activity-cost');

  if (isEdit) {
    modalTitle.textContent = 'Edit Activity';
    saveActivityBtn.textContent = 'Save Changes';
    deleteActivityBtn.style.display = 'inline-block';

    const activity = activities[index];
    activityTitle.value = activity.title;
    activityDescription.value = activity.description || '';
    activityCost.value = activity.cost;

    activityForm.dataset.editingId = activity.id;
  } else {
    modalTitle.textContent = 'Add Activity';
    saveActivityBtn.textContent = 'Add Activity';
    deleteActivityBtn.style.display = 'none';

    activityForm.reset();
    delete activityForm.dataset.editingId;
  }

  modal.style.display = 'flex';
}



// 📝 Edit Activity
function editActivity(id) {
  const activity = activities.find(a => a.id === id);
  if (activity) {
    document.getElementById('activity-title').value = activity.title;
    document.getElementById('activity-description').value = activity.description;
    document.getElementById('activity-duration').value = activity.duration;
    document.getElementById('activity-cost').value = activity.cost;

    activityForm.dataset.editingId = id;

    showModal('Edit Activity');
  }
}

// 🗑️ Delete Activity
function deleteActivity(id) {
  activities = activities.filter(a => a.id !== id);
  saveActivities();
  displayActivities();
  console.log(`🗑️ Activity Deleted (ID: ${id})`);
}


// 🗑️ Handle Delete Button in Modal
document.getElementById('delete-activity-btn').addEventListener('click', () => {
  const editingId = activityForm.dataset.editingId;
  if (editingId) {
    deleteActivity(parseInt(editingId));
    modal.style.display = 'none';
    activityForm.reset();
    console.log(`🗑️ Activity Deleted (ID: ${editingId})`);
  }
});



// 💾 Save Activities to LocalStorage
function saveActivities() {
  localStorage.setItem('activities', JSON.stringify(activities));
}

// 📦 Load Activities from LocalStorage
function loadActivities() {
  const savedActivities = localStorage.getItem('activities');
  if (savedActivities) {
    activities = JSON.parse(savedActivities);
  }
}

// 🚀 Initialize
loadActivities();
displayActivities();
