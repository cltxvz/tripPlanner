// 📌 DOM Elements
const dayPlanContainer = document.getElementById('day-plan');
const activityPool = document.getElementById('activity-pool');
const activityTimeModal = document.getElementById('activity-time-modal');
const activityTimeInput = document.getElementById('activity-time');
const confirmTimeBtn = document.getElementById('confirm-time');
const closeModalBtn = document.getElementById('close-modal');
const manageActivitiesBtn = document.getElementById('manage-activities-btn');
const finishPlanningBtn = document.getElementById('finish-planning');

// 🚀 Navigate to Activities Page
manageActivitiesBtn.addEventListener('click', () => {
    console.log('📋 Redirecting to Manage Activities Page...');
    window.location.href = 'activities.html';
});

// 🗓️ Day Plan Data
let dayPlan = [];
let draggedActivity = null;
const activities = JSON.parse(localStorage.getItem('activities')) || [];

// 🛡️ Page Initialization on Load
window.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Page Loaded: Initializing day planner...');

    if (activityTimeModal) activityTimeModal.style.display = 'none';

    // Check if editing an existing day plan
    const currentDayPlan = JSON.parse(localStorage.getItem('currentDayPlan'));
    if (currentDayPlan && currentDayPlan.dayPlan) {
        console.log('📥 Loading existing day plan for editing:', currentDayPlan);
    
        // Generate Day Block with fixed times
        generateDayBlock();
    
        // Load Existing Day Plan into Drop Zone
        dayPlan = currentDayPlan.dayPlan;
        saveDayPlan();
        organizeDayPlan();
        updateTotalCost();
    
        localStorage.removeItem('currentDayPlan');
    } else {
        console.log('🧹 Starting with a clean day plan');
        dayPlan = []; // Clear day plan for a fresh start
        saveDayPlan();
        generateDayBlock();
        organizeDayPlan();
    }
    

    // Load Activities After Day Plan
    loadActivities();
});

// 🚀 Generate Fixed Day Block (12:00 AM - 12:00 AM)
function generateDayBlock() {
    console.log(`✅ Generating Day Block: 12:00 AM - 12:00 AM`);

    dayPlanContainer.innerHTML = `
        <div id="day-block" data-start="00:00" data-end="24:00" class="day-block">
            <h3>Day Plan (12:00 AM - 12:00 AM)</h3>
            <div id="activity-drop-zone" class="activity-drop-zone">
                <p>Drag activities here to plan your day</p>
            </div>
        </div>
    `;

    const dropZone = document.getElementById('activity-drop-zone');
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', handleDrop);
}

// 📦 Load Activities into Pool (Exclude Scheduled Activities)
function loadActivities() {
    console.log('📦 Loading Activities into Pool');
    const storedActivities = localStorage.getItem('activities');
    console.log('📦 Raw Activities from LocalStorage:', storedActivities);

    activities.length = 0; // Clear the existing array

    if (storedActivities) {
        activities.push(...JSON.parse(storedActivities));
    }

    console.log('📦 Parsed Activities Array:', activities);

    activityPool.innerHTML = ''; // Clear the pool before repopulating

    if (activities.length === 0) {
        console.warn('⚠️ No activities found in localStorage');
        activityPool.innerHTML = '<p>No activities available. Go to Manage Activities to add new ones.</p>';
        return;
    }

    activities.forEach(activity => {
        console.log(`🔍 Checking Activity: ${activity.title} (ID: ${activity.id})`);

        // Check if activity is already scheduled in dayPlan
        const isScheduled = dayPlan.some(scheduled => {
            console.log(
                `🔗 Comparing Scheduled ID (${scheduled.id}) with Activity ID (${activity.id})`
            );
            return String(scheduled.id) === String(activity.id);
        });

        if (isScheduled) {
            console.log(`⏳ Skipping Scheduled Activity: ${activity.title}`);
        } else {
            console.log(`✅ Adding Unscheduled Activity: ${activity.title}`);
            createActivityItem(activity); // Add only unscheduled activities
        }
    });

    console.log('✅ Activities Loaded into Pool (Excluding Scheduled Activities):', activities);
}




// 🚀 Add Activity to Day Plan
function addActivityToDayPlan(activity, startTime, endTime) {
    console.log(`📌 Adding Activity: ${activity.title} (${startTime} - ${endTime})`);

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
    hideActivityFromPool(activity.id);
}

// ✅ Check Time Slot Availability
function canBookActivity(startTime, endTime) {
    console.log(`🔍 Checking if time slot (${startTime} - ${endTime}) is available`);

    return dayPlan.every(activity => {
        return endTime <= activity.startTime || startTime >= activity.endTime;
    });
}

// 💾 Save Day Plan to localStorage
function saveDayPlan() {
    localStorage.setItem('dayPlan', JSON.stringify(dayPlan));
    console.log('💾 Day Plan Saved:', dayPlan);
}

// 📥 Load Day Plan from localStorage
function loadDayPlan() {
    const storedDayPlan = localStorage.getItem('dayPlan');
    console.log('📥 Raw Day Plan from LocalStorage:', storedDayPlan);

    dayPlan = storedDayPlan ? JSON.parse(storedDayPlan) : [];
    console.log('✅ Parsed Day Plan Array:', dayPlan);

    organizeDayPlan();
}


// 🚀 Handle Drop
function handleDrop(e) {
    if (!draggedActivity) {
        alert('❌ No activity selected for this time slot.');
        return;
    }

    activityTimeModal.style.display = 'flex';
    activityTimeInput.value = '';
}

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

    console.log(`🕒 Confirming Activity Time: Start - ${startTime}, Day Start - ${dayStart}, Day End - ${dayEnd}`);

    if (!startTime || startTime < dayStart || startTime >= dayEnd) {
        alert('❌ Please enter a valid start time within the day range.');
        return;
    }

    const activityEndTime = calculateEndTime(startTime, draggedActivity.duration);

    console.log(`🧠 Activity Start: ${startTime}, Activity End: ${activityEndTime}`);

    if (activityEndTime > dayEnd || !canBookActivity(startTime, activityEndTime)) {
        alert('❌ Time slot is already occupied or exceeds day limit.');
        return;
    }

    addActivityToDayPlan(draggedActivity, startTime, activityEndTime);
    hideActivityFromPool(draggedActivity.id);
    activityTimeModal.style.display = 'none';
    draggedActivity = null;
    console.log('✅ Activity Added to Day Plan');
});


// ✅ Finish Planning and Redirect
finishPlanningBtn.addEventListener('click', () => {
    console.log('✅ Finishing Planning for the Day');

    const totalCost = dayPlan.reduce((sum, activity) => sum + activity.cost, 0);
    const currentDayPlan = {
        dayPlan,
        totalCost
    };

    const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || { days: 0, dayPlans: {} };
    const selectedDay = localStorage.getItem('selectedDay');

    if (!selectedDay) {
        alert('❌ No day selected. Returning to trip overview.');
        window.location.href = 'trip.html';
        return;
    }

    tripDetails.dayPlans[selectedDay] = currentDayPlan;
    localStorage.setItem('tripDetails', JSON.stringify(tripDetails));
    console.log(`📅 Day ${selectedDay} updated successfully.`);

    window.location.href = 'trip.html';
});

// 📋 Create Individual Activity Item
function createActivityItem(activity) {
    console.log(`🎯 Creating Activity Item: ${activity.title}`);

    const activityItem = document.createElement('div');
    activityItem.classList.add('activity-item');
    activityItem.textContent = `${activity.title} (${activity.duration}h, $${activity.cost.toFixed(2)})`;
    activityItem.draggable = true;
    activityItem.dataset.id = activity.id;

    // Add Drag Events
    activityItem.addEventListener('dragstart', handleDragStart);
    activityItem.addEventListener('dragend', handleDragEnd);

    activityPool.appendChild(activityItem);
}

// 🌟 Organize Day Plan with Costs Displayed
function organizeDayPlan() {
    console.log('🔄 Organizing Day Plan...');
    const dropZone = document.getElementById('activity-drop-zone');
    if (!dropZone) {
        console.error('❌ Drop Zone not found.');
        return;
    }

    dropZone.innerHTML = ''; // Clear the drag zone

    if (dayPlan.length === 0) {
        // Display default drag message when no activities are scheduled
        dropZone.innerHTML = `<p>Drag activities here to plan your day</p>`;
        console.log('ℹ️ Day Plan is empty. Showing default message.');
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

        console.log('✅ Day Plan organized successfully.');
    }

    updateTotalCost();
}

// 💰 Calculate and Display Total Cost
function updateTotalCost() {
    console.log('💰 Updating Total Cost...');
    const totalCost = dayPlan.reduce((sum, activity) => sum + activity.cost, 0);
    const totalCostElement = document.getElementById('total-cost');

    if (totalCostElement) {
        totalCostElement.textContent = `Total Cost: $${totalCost.toFixed(2)}`;
        console.log(`💵 Total Cost Updated: $${totalCost.toFixed(2)}`);
    } else {
        console.warn('⚠️ Total Cost element not found in DOM.');
    }
}

// 🚀 Handle Drag Start
function handleDragStart(e) {
    draggedActivity = activities.find(a => a.id == e.target.dataset.id);
    console.log('🚚 Dragging Activity:', draggedActivity);
    e.target.classList.add('dragging');
}

// 🚀 Handle Drag End
function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    console.log('🛑 Drag Ended');
}

// 🧮 Calculate End Time
function calculateEndTime(startTime, duration) {
    console.log(`🧮 Calculating End Time from Start Time: ${startTime} and Duration: ${duration}`);

    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration * 60;

    const endHours = Math.floor(totalMinutes / 60) % 24; // Ensure it wraps around 24 hours if needed
    const endMinutes = totalMinutes % 60;

    const formattedHours = String(endHours).padStart(2, '0');
    const formattedMinutes = String(endMinutes).padStart(2, '0');

    const endTime = `${formattedHours}:${formattedMinutes}`;
    console.log(`✅ Calculated End Time: ${endTime}`);

    return endTime;
}

// 🗑️ Hide Activity from Pool (Do NOT Remove from Data)
function hideActivityFromPool(activityId) {
    console.log(`👀 Hiding Activity from Pool: ${activityId}`);
    const activityItem = activityPool.querySelector(`[data-id="${activityId}"]`);
    if (activityItem) {
        activityItem.style.display = 'none'; // Hide instead of removing
        console.log(`✅ Activity ID ${activityId} hidden from pool.`);
    } else {
        console.warn(`⚠️ Activity ID ${activityId} not found in the pool.`);
    }
}

// 🗑️ Delete Activity from Day Plan
function deleteActivityFromDayPlan(activityId) {
    console.log(`🗑️ Deleting Activity ID: ${activityId} from Day Plan`);

    // Find and remove the activity from dayPlan
    dayPlan = dayPlan.filter(activity => String(activity.id) !== String(activityId));

    // Save and refresh UI
    saveDayPlan();
    organizeDayPlan();
    loadActivities();

    console.log(`✅ Activity ID ${activityId} successfully removed from Day Plan`);
}

