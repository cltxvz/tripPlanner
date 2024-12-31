// 📌 DOM Elements
const dayConfigForm = document.getElementById('day-config-form');
const startTimeInput = document.getElementById('start-time');
const endTimeInput = document.getElementById('end-time');
const dayPlanContainer = document.getElementById('day-schedule');
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
    if (activityTimeModal) {
        activityTimeModal.style.display = 'none';
    }
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

    console.log(`Day Block created: ${startTime} - ${endTime}`);
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
    const dayBlock = document.getElementById('day-block');
    const dayStart = dayBlock.dataset.start;
    const dayEnd = dayBlock.dataset.end;

    if (!startTime || startTime < dayStart || startTime >= dayEnd) {
        alert('Please enter a valid start time within the day range.');
        return;
    }

    addActivityToDayPlan(draggedActivity, startTime);
    activityTimeModal.style.display = 'none';
    draggedActivity = null;
});

// 🌟 Add Activity to Day Plan
function addActivityToDayPlan(activity, startTime) {
    const existingActivity = dayPlan.find(a => a.startTime === startTime);
    if (existingActivity) {
        alert('An activity already exists at this time slot. Choose a different time.');
        return;
    }

    dayPlan.push({
        id: activity.id,
        title: activity.title,
        duration: activity.duration,
        cost: activity.cost,
        startTime,
    });

    organizeDayPlan();
    saveDayPlan();
}

// 🌟 Organize Day Plan
function organizeDayPlan() {
    dayPlan.sort((a, b) => a.startTime.localeCompare(b.startTime));
    const dropZone = document.getElementById('activity-drop-zone');
    dropZone.innerHTML = '';

    dayPlan.forEach(activity => {
        const activitySlot = document.createElement('div');
        activitySlot.classList.add('activity-slot');
        activitySlot.innerHTML = `
            <div>
                <strong>${activity.title}</strong><br>
                Time: ${activity.startTime}<br>
                Duration: ${activity.duration}h<br>
                Cost: $${activity.cost.toFixed(2)}
            </div>
            <button class="remove-activity">Remove</button>
        `;
        activitySlot.querySelector('.remove-activity').addEventListener('click', () => {
            dayPlan = dayPlan.filter(a => a.startTime !== activity.startTime);
            organizeDayPlan();
            saveDayPlan();
        });

        dropZone.appendChild(activitySlot);
    });
}

// 💾 Save Day Plan
function saveDayPlan() {
    localStorage.setItem('dayPlan', JSON.stringify(dayPlan));
}

// 📦 Load Day Plan
function loadDayPlan() {
    const savedDayPlan = JSON.parse(localStorage.getItem('dayPlan')) || [];
    dayPlan = savedDayPlan;
    organizeDayPlan();
}
