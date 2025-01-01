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

// 🛡️ Initialize Page on Load
window.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Page Loaded: Initializing day planner...');
    if (activityTimeModal) activityTimeModal.style.display = 'none';

    // Load Day Block Configuration
    const dayBlockConfig = JSON.parse(localStorage.getItem('dayBlockConfig'));
    if (dayBlockConfig && dayBlockConfig.startTime && dayBlockConfig.endTime) {
        generateDayBlock(dayBlockConfig.startTime, dayBlockConfig.endTime);
        
        // Populate the input fields with saved times
        startTimeInput.value = dayBlockConfig.startTime;
        endTimeInput.value = dayBlockConfig.endTime;
        console.log('⏳ Restored Start and End Times:', dayBlockConfig.startTime, dayBlockConfig.endTime);
    }

    loadActivities();
    loadDayPlan();
});


// 📥 Load Day Plan from localStorage
function loadDayPlan() {
    const storedDayPlan = localStorage.getItem('dayPlan');
    dayPlan = storedDayPlan ? JSON.parse(storedDayPlan) : [];
    console.log('📥 Day Plan Loaded:', dayPlan);

    if (dayPlan.length > 0) {
        organizeDayPlan();
    }
}


// 🚀 Configure Day Plan Block
dayConfigForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;

    console.log(`🕒 Setting Day Plan: Start: ${startTime}, End: ${endTime}`);

    if (!startTime || !endTime || startTime >= endTime) {
        alert('❌ Please select valid start and end times.');
        return;
    }

    generateDayBlock(startTime, endTime);
    saveDayPlan();
});


// 🕒 Create Day Block
function generateDayBlock(startTime, endTime) {
    console.log(`✅ Creating Day Block: ${startTime} - ${endTime}`);

    dayPlanContainer.innerHTML = `
        <div id="day-block" data-start="${startTime}" data-end="${endTime}" class="day-block">
            <h3>Day Plan (${startTime} - ${endTime})</h3>
            <div id="activity-drop-zone" class="activity-drop-zone">
                <p>Drag activities here to plan your day</p>
            </div>
        </div>
    `;

    const dropZone = document.getElementById('activity-drop-zone');
    if (!dropZone) {
        console.error('❌ Drop Zone not found after creating Day Block');
        return;
    }

    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', handleDrop);

    // Save day block configuration in localStorage
    localStorage.setItem('dayBlockConfig', JSON.stringify({ startTime, endTime }));
    console.log('💾 Day Block Config Saved:', { startTime, endTime });
}


// 🌟 Load Activities into Pool
function loadActivities() {
    console.log('📦 Loading Activities into Pool');
    activityPool.innerHTML = '';
    activities.forEach(activity => {
        createActivityItem(activity);
    });
}

function createActivityItem(activity) {
    const activityItem = document.createElement('div');
    activityItem.classList.add('activity-item');
    activityItem.textContent = `${activity.title} (${activity.duration}h, $${activity.cost.toFixed(2)})`;
    activityItem.draggable = true;
    activityItem.dataset.id = activity.id;
    activityItem.addEventListener('dragstart', handleDragStart);
    activityItem.addEventListener('dragend', handleDragEnd);
    activityPool.appendChild(activityItem);
}


// 🚀 Drag Events
function handleDragStart(e) {
    draggedActivity = activities.find(a => a.id == e.target.dataset.id);
    console.log('🚚 Dragging Activity:', draggedActivity);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    console.log('🛑 Drag Ended');
}


// 🚀 Handle Drop
function handleDrop(e) {
    if (!draggedActivity) {
        alert('❌ No activity selected for this time slot.');
        return;
    }

    const dayBlock = document.getElementById('day-block');
    if (!dayBlock) {
        alert('❌ Please configure the day block first.');
        return;
    }

    console.log('📥 Drop Detected. Activity:', draggedActivity);

    activityTimeModal.style.display = 'flex';
    activityTimeInput.value = '';
}


// ❌ Close Modal
closeModalBtn.addEventListener('click', () => {
    activityTimeModal.style.display = 'none';
    draggedActivity = null;
    console.log('❌ Modal Closed & draggedActivity Reset');
});


// 🚀 Confirm Activity Time
confirmTimeBtn.addEventListener('click', () => {
    const startTime = activityTimeInput.value;
    const dayBlock = document.getElementById('day-block');

    if (!dayBlock) {
        console.error('❌ Day Block not found.');
        return;
    }

    const dayStart = dayBlock.dataset.start;
    const dayEnd = dayBlock.dataset.end;

    if (!startTime || startTime < dayStart || startTime >= dayEnd) {
        alert('❌ Please enter a valid start time within the day range.');
        return;
    }

    const activityEndTime = calculateEndTime(startTime, draggedActivity.duration);

    if (activityEndTime > dayEnd || !canBookActivity(startTime, activityEndTime)) {
        alert('❌ Time slot is already occupied or exceeds day limit.');
        return;
    }

    addActivityToDayPlan(draggedActivity, startTime, activityEndTime);
    removeActivityFromPool(draggedActivity.id);
    activityTimeModal.style.display = 'none';
    draggedActivity = null;
    console.log('✅ Activity Added to Day Plan');
});


// 🌟 Add Activity to Day Plan
function addActivityToDayPlan(activity, startTime, endTime) {
    console.log(`📌 Adding Activity to Day Plan: ${activity.title} (${startTime} - ${endTime})`);

    dayPlan.push({
        id: activity.id,
        title: activity.title,
        duration: activity.duration,
        cost: activity.cost,
        startTime,
        endTime
    });

    organizeDayPlan();
    saveDayPlan();
}


// 🗑️ Remove Activity from Pool and Save Changes
function removeActivityFromPool(activityId) {
    console.log(`🗑️ Removing Activity from Pool: ${activityId}`);
    const activityIndex = activities.findIndex(a => a.id == activityId);
    if (activityIndex !== -1) {
        activities.splice(activityIndex, 1);
        localStorage.setItem('activities', JSON.stringify(activities));
    }

    const activityItem = activityPool.querySelector(`[data-id="${activityId}"]`);
    if (activityItem) {
        activityItem.remove();
    }
}


// 🧮 Calculate End Time
function calculateEndTime(startTime, duration) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration * 60;

    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}


// ✅ Check Time Slot
function canBookActivity(startTime, endTime) {
    for (const activity of dayPlan) {
        if (Math.max(activity.startTime, startTime) < Math.min(activity.endTime, endTime)) {
            return false;
        }
    }
    return true;
}


// 🌟 Organize Day Plan
function organizeDayPlan() {
    const dropZone = document.getElementById('activity-drop-zone');
    if (!dropZone) return;

    dropZone.innerHTML = '';
    dayPlan.sort((a, b) => a.startTime.localeCompare(b.startTime));
    dayPlan.forEach(activity => {
        dropZone.innerHTML += `<p><strong>${activity.title}</strong> (${activity.startTime} - ${activity.endTime})</p>`;
    });
}


// 💾 Save Day Plan
function saveDayPlan() {
    localStorage.setItem('dayPlan', JSON.stringify(dayPlan));
}
