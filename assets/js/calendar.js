// 📌 DOM Elements
const dayConfigForm = document.getElementById('day-config-form');
const startTimeInput = document.getElementById('start-time');
const endTimeInput = document.getElementById('end-time');
const dayPlanContainer = document.getElementById('day-plan');
const activityPool = document.getElementById('activity-pool');
const activityTimeModal = document.getElementById('activity-time-modal');
const activityTimeInput = document.getElementById('activity-time');
const confirmTimeBtn = document.getElementById('confirm-time');
const closeModalBtn = document.getElementById('close-modal');

// 🗓️ Day Plan Data
let dayPlan = [];
let draggedActivity = null;
const activities = JSON.parse(localStorage.getItem('activities')) || [];

// 🛡️ Ensure Modal is Hidden on Page Load
window.addEventListener('DOMContentLoaded', () => {
  activityTimeModal.style.display = 'none';
  loadActivities();
  loadDayPlan();
});

// 🚀 Configure Day Plan Block
dayConfigForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  if (!startTime || !endTime || startTime >= endTime) {
    alert('Please select valid start and end times.');
    return;
  }

  generateDayBlock(startTime, endTime);
  saveDayPlan();
});

// 🕒 Create Day Block
function generateDayBlock(startTime, endTime) {
  dayPlanContainer.innerHTML = `
    <div id="day-block" data-start="${startTime}" data-end="${endTime}" class="day-block">
      <h3>Day Plan (${startTime} - ${endTime})</h3>
      <div id="activity-drop-zone" class="activity-drop-zone">
        <p>Drag activities here to plan your day</p>
      </div>
    </div>
  `;

  const dropZone = document.getElementById('activity-drop-zone');
  dropZone.addEventListener('dragover', (e) => e.preventDefault());
  dropZone.addEventListener('drop', handleDrop);
}

// 🌟 Load Activities into Pool
function loadActivities() {
  activityPool.innerHTML = '';
  activities.forEach(activity => {
    const activityItem = document.createElement('div');
    activityItem.classList.add('activity-item');
    activityItem.textContent = `${activity.title} (${activity.duration}h, $${activity.cost.toFixed(2)})`;
    activityItem.draggable = true;
    activityItem.dataset.id = activity.id;
    activityItem.addEventListener('dragstart', handleDragStart);
    activityItem.addEventListener('dragend', handleDragEnd);
    activityPool.appendChild(activityItem);
  });
}

// 🚀 Drag Events
function handleDragStart(e) {
  draggedActivity = activities.find(a => a.id == e.target.dataset.id);
  e.target.classList.add('dragging');
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
  draggedActivity = null;
}

// 🚀 Handle Drop
function handleDrop(e) {
  if (!draggedActivity) return;

  activityTimeModal.style.display = 'flex';
  activityTimeInput.value = '';
}

// ❌ Close Modal
closeModalBtn.addEventListener('click', () => {
  activityTimeModal.style.display = 'none';
  draggedActivity = null;
});

// 🚀 Confirm Activity Time
confirmTimeBtn.addEventListener('click', () => {
  const startTime = activityTimeInput.value;
  const dayStart = document.getElementById('day-block').dataset.start;
  const dayEnd = document.getElementById('day-block').dataset.end;

  if (!startTime || startTime < dayStart || startTime >= dayEnd) {
    alert('Please enter a valid start time within the day range.');
    return;
  }

  addActivityToDayPlan(draggedActivity, startTime);
  activityTimeModal.style.display = 'none';
});

// 🌟 Add Activity to Day Plan
function addActivityToDayPlan(activity, startTime) {
  dayPlan.push({
    id: activity.id,
    title: activity.title,
    duration: activity.duration,
    cost: activity.cost,
    startTime,
  });
  organizeDayPlan();
}

// 🌟 Organize Day Plan
function organizeDayPlan() {
  dayPlan.sort((a, b) => a.startTime.localeCompare(b.startTime));
  const dropZone = document.getElementById('activity-drop-zone');
  dropZone.innerHTML = '';

  dayPlan.forEach(activity => {
    dropZone.innerHTML += `<p>${activity.title} (${activity.startTime})</p>`;
  });

  saveDayPlan();
}

// 💾 Save Day Plan
function saveDayPlan() {
  localStorage.setItem('dayPlan', JSON.stringify(dayPlan));
}

// 📦 Load Day Plan
function loadDayPlan() {
  dayPlan = JSON.parse(localStorage.getItem('dayPlan')) || [];
  organizeDayPlan();
}
