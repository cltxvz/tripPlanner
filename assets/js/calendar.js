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

// 🛡️ Page Initialization on Load
window.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Page Loaded: Initializing day planner...');

    if (activityTimeModal) activityTimeModal.style.display = 'none';

    // Load Day Block Configuration
    const dayBlockConfig = JSON.parse(localStorage.getItem('dayBlockConfig'));
    if (dayBlockConfig && dayBlockConfig.startTime && dayBlockConfig.endTime) {
        generateDayBlock(dayBlockConfig.startTime, dayBlockConfig.endTime);
        startTimeInput.value = dayBlockConfig.startTime;
        endTimeInput.value = dayBlockConfig.endTime;
    }

    // Check if editing an existing day plan
    const currentDayPlan = JSON.parse(localStorage.getItem('currentDayPlan'));
    if (currentDayPlan) {
        console.log('📥 Loading existing day plan for editing:', currentDayPlan);

        // Load Start and End Times
        startTimeInput.value = currentDayPlan.startTime;
        endTimeInput.value = currentDayPlan.endTime;

        // Generate Day Block with existing times
        generateDayBlock(currentDayPlan.startTime, currentDayPlan.endTime);

        // Load Existing Day Plan into Drop Zone
        dayPlan = currentDayPlan.dayPlan || [];
        saveDayPlan(); // Persist loaded day plan in localStorage
        organizeDayPlan();
        updateTotalCost();

        // Clear currentDayPlan from storage (optional, to avoid conflicts)
        localStorage.removeItem('currentDayPlan');
    } else {
        loadDayPlan(); // Fallback to default behavior
    }

    // Load Activities After Day Plan
    loadActivities();
});






// 📥 Load Day Plan from localStorage
function loadDayPlan() {
    const storedDayPlan = localStorage.getItem('dayPlan');
    dayPlan = storedDayPlan ? JSON.parse(storedDayPlan) : [];
    console.log('📥 Day Plan Loaded:', dayPlan);

    organizeDayPlan();
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


// 🕒 Create or Reset Day Block
function generateDayBlock(startTime, endTime) {
    console.log(`✅ Creating/Resetting Day Block: ${startTime} - ${endTime}`);

    // Do NOT restore scheduled activities to the pool
    // Only clear the day plan visually
    dayPlan = []; // Clear the day plan array
    saveDayPlan(); // Save the cleared day plan

    // Reset the day plan display
    dayPlanContainer.innerHTML = `
        <div id="day-block" data-start="${startTime}" data-end="${endTime}" class="day-block">
            <h3>Day Plan (${startTime} - ${endTime})</h3>
            <div id="activity-drop-zone" class="activity-drop-zone">
                <p>Drag activities here to plan your day</p>
            </div>
        </div>
    `;

    // Add event listeners for drag-and-drop functionality to the drop zone
    const dropZone = document.getElementById('activity-drop-zone');
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', handleDrop);

    // Save new day block configuration
    localStorage.setItem('dayBlockConfig', JSON.stringify({ startTime, endTime }));

    // Reload activities to ensure all unscheduled activities are displayed
    loadActivities();

    console.log('🔄 Day Plan Reset without Restoring Scheduled Activities to Pool');
}





// 📦 Load Activities into Pool (Exclude Scheduled Activities)
function loadActivities() {
    console.log('📦 Loading Activities into Pool');
    const storedActivities = localStorage.getItem('activities');
    activities.length = 0; // Clear the existing array

    if (storedActivities) {
        activities.push(...JSON.parse(storedActivities));
    }

    activityPool.innerHTML = ''; // Clear the pool before repopulating

    activities.forEach(activity => {
        const isScheduled = dayPlan.some(scheduled => String(scheduled.id) === String(activity.id));
        if (!isScheduled) {
            createActivityItem(activity); // Add only unscheduled activities
        }
    });

    console.log('✅ Activities Loaded into Pool (Excluding Scheduled Activities):', activities);
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

    if (activityEndTime > dayEnd) {
        alert('❌ Activity exceeds the day end time.');
        return;
    }

    if (!canBookActivity(startTime, activityEndTime)) {
        alert('❌ Time slot is already occupied by another activity.');
        return;
    }

    addActivityToDayPlan(draggedActivity, startTime, activityEndTime);
    hideActivityFromPool(draggedActivity.id);
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

    saveDayPlan();
    organizeDayPlan();
    hideActivityFromPool(activity.id); // Hide from pool
}



// 🗑️ Hide Activity from Pool (Do NOT Remove from Data)
function hideActivityFromPool(activityId) {
    console.log(`👀 Hiding Activity from Pool: ${activityId}`);
    const activityItem = activityPool.querySelector(`[data-id="${activityId}"]`);
    if (activityItem) {
        activityItem.style.display = 'none'; // Hide instead of removing
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



// ✅ Check Time Slot Availability (Prevent Overlaps)
function canBookActivity(startTime, endTime) {
    console.log(`🔍 Checking if time slot (${startTime} - ${endTime}) is available`);

    return dayPlan.every(activity => {
        const activityStart = activity.startTime;
        const activityEnd = activity.endTime;

        // Check for any overlap
        const noOverlap = endTime <= activityStart || startTime >= activityEnd;
        return noOverlap;
    });
}

// 💰 Calculate and Display Total Cost
function updateTotalCost() {
    const totalCost = dayPlan.reduce((sum, activity) => sum + activity.cost, 0);
    const totalCostElement = document.getElementById('total-cost');
    if (totalCostElement) {
        totalCostElement.textContent = `Total Cost: $${totalCost.toFixed(2)}`;
    }
    console.log('💰 Total Cost Updated:', totalCost);
}



// 🌟 Organize Day Plan with Costs Displayed
function organizeDayPlan() {
    const dropZone = document.getElementById('activity-drop-zone');
    if (!dropZone) return;

    dropZone.innerHTML = ''; // Clear the drag zone

    if (dayPlan.length === 0) {
        // Display default drag message when no activities are scheduled
        dropZone.innerHTML = `<p>Drag activities here to plan your day</p>`;
    } else {
        // Display scheduled activities with cost
        dayPlan.sort((a, b) => a.startTime.localeCompare(b.startTime));
        dayPlan.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.classList.add('scheduled-activity');
            activityElement.innerHTML = `
                <p>
                    <strong>${activity.title}</strong> (${activity.startTime} - ${activity.endTime}) 
                    - Cost: $${activity.cost.toFixed(2)}
                </p>
                <button class="delete-activity" data-id="${activity.id}">Delete</button>
            `;
            dropZone.appendChild(activityElement);

            // Add delete functionality
            const deleteButton = activityElement.querySelector('.delete-activity');
            deleteButton.addEventListener('click', () => deleteActivityFromDayPlan(activity.id));
        });
    }

    updateTotalCost();
}




// 🗑️ Delete Activity from Day Plan & Restore Availability
function deleteActivityFromDayPlan(activityId) {
    console.log(`🗑️ Deleting Activity from Day Plan: ${activityId}`);

    // Find the activity in the day plan
    const deletedActivity = dayPlan.find(activity => activity.id === activityId);
    if (!deletedActivity) {
        console.warn('❌ Activity not found in Day Plan');
        return;
    }

    // Remove the activity from the day plan
    dayPlan = dayPlan.filter(activity => activity.id !== activityId);

    // Save the updated day plan
    saveDayPlan();

    // Make the activity visible in the pool again
    restoreActivityToPool(deletedActivity.id);

    // Reorganize the day plan display and activities pool
    organizeDayPlan();
    loadActivities();
}

// 🔄 Restore Activity to Pool
function restoreActivityToPool(activityId) {
    console.log(`🔄 Restoring Activity to Pool: ${activityId}`);
    const activity = activities.find(a => a.id === activityId);

    if (!activity) {
        console.warn('❌ Activity not found in Activities list');
        return;
    }

    createActivityItem(activity); // Add activity back to the pool visually
}

// 🚀 Finish Planning and Redirect
const finishPlanningBtn = document.getElementById('finish-planning');
finishPlanningBtn.addEventListener('click', () => {
    console.log('✅ Finishing Planning for the Day');

    // Prepare the day plan data
    const totalCost = dayPlan.reduce((sum, activity) => sum + activity.cost, 0);
    const currentDayPlan = {
        dayPlan,
        totalCost,
        startTime: startTimeInput.value,
        endTime: endTimeInput.value
    };

    // Retrieve tripDetails from localStorage
    const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || { days: 0, dayPlans: {} };

    // Get selected day
    const selectedDay = localStorage.getItem('selectedDay');
    if (!selectedDay) {
        alert('❌ No day selected. Returning to trip overview.');
        window.location.href = 'trip.html';
        return;
    }

    // Update the selected day in tripDetails
    tripDetails.dayPlans = tripDetails.dayPlans || {};
    tripDetails.dayPlans[selectedDay] = currentDayPlan;

    // Save updated tripDetails back to localStorage
    localStorage.setItem('tripDetails', JSON.stringify(tripDetails));

    // Clear the currentDayPlan data
    localStorage.removeItem('currentDayPlan');
    console.log(`📅 Day ${selectedDay} updated successfully in tripDetails.`);

    // Redirect to trip overview
    window.location.href = 'trip.html';
});






// 💾 Save Day Plan to localStorage
function saveDayPlan() {
    localStorage.setItem('dayPlan', JSON.stringify(dayPlan));
    console.log('💾 Day Plan Saved:', dayPlan);
}
