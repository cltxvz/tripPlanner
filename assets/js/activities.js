// 📌 DOM Elements
const activityForm = document.getElementById('activity-form');
const activityList = document.getElementById('activity-list');
const addActivityBtn = document.getElementById('add-activity-btn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');

// 📚 Activity Array
let activities = [];

// Open Modal for Adding a New Activity
addActivityBtn.addEventListener('click', () => {
  activityForm.reset();
  delete activityForm.dataset.editingId;
  document.querySelector('.modal-content h2').innerText = 'Add a New Activity';
  document.querySelector('#activity-form button').innerText = 'Add Activity';
  modal.style.display = 'block';
});

// Close Modal
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close Modal on Outside Click
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
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
  modal.style.display = 'none';
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

    document.querySelector('.modal-content h2').innerText = 'Edit Activity';
    document.querySelector('#activity-form button').innerText = 'Edit Activity';
    modal.style.display = 'block';
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
