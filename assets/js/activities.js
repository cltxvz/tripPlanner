// 📌 DOM Elements
const activityForm = document.getElementById('activity-form');
const activityList = document.getElementById('activity-list');
const addActivityBtn = document.getElementById('add-activity-btn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const saveGoBackBtn = document.getElementById('save-go-back-btn');

// 📚 Activity Array
let activities = [];

// 🛡️ Ensure Modal is Hidden on Page Load
window.addEventListener('DOMContentLoaded', () => {
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

// ❌ Close Modal Function
function closeModalHandler() {
  modal.style.display = 'none';
}

// Open Modal for Adding a New Activity
addActivityBtn.addEventListener('click', () => {
  activityForm.reset();
  delete activityForm.dataset.editingId;
  showModal('Add a New Activity');
});

// Close Modal
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
  const duration = parseFloat(document.getElementById('activity-duration').value);
  const cost = parseFloat(document.getElementById('activity-cost').value) || 0;

  if (!title || isNaN(duration) || duration <= 0) {
    alert('Please provide valid title and duration.');
    return;
  }

  const editingId = activityForm.dataset.editingId;

  if (editingId) {
    const activity = activities.find(a => a.id === parseInt(editingId));
    if (activity) {
      activity.title = title;
      activity.description = description;
      activity.duration = duration;
      activity.cost = cost;
    }
    delete activityForm.dataset.editingId;
  } else {
    const newActivity = {
      id: Date.now(),
      title,
      description,
      duration,
      cost,
    };
    activities.push(newActivity);
  }

  saveActivities();
  displayActivities();
  activityForm.reset();
  closeModalHandler();
});

// 📋 Display Activities
function displayActivities() {
  activityList.innerHTML = '';

  activities.forEach(activity => {
    const activityItem = document.createElement('div');
    activityItem.classList.add('activity-item');
    activityItem.innerHTML = `
      <h3>${activity.title}</h3>
      <p><strong>Description:</strong> ${activity.description}</p>
      <p><strong>Duration:</strong> ${activity.duration} hours</p>
      <p><strong>Cost:</strong> $${activity.cost.toFixed(2)}</p>
      <div class="activity-actions">
        <button onclick="editActivity(${activity.id})">Edit</button>
        <button onclick="deleteActivity(${activity.id})">Delete</button>
      </div>
    `;
    activityList.appendChild(activityItem);
  });
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
}

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
