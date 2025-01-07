// 📌 DOM Elements
const dayPlanContainer = document.getElementById('day-plan');
const activityPool = document.getElementById('activity-pool');
const activityTimeModal = document.getElementById('activity-time-modal');
const activityTimeInput = document.getElementById('activity-time');
const confirmTimeBtn = document.getElementById('confirm-time');
const closeModalBtn = document.getElementById('close-modal');
const manageActivitiesBtn = document.getElementById('manage-activities-btn');
const finishPlanningBtn = document.getElementById('finish-planning');
const activityStartTimeInput = document.getElementById('activity-time-start');
const activityEndTimeInput = document.getElementById('activity-time-end');


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

// 🚀 Navigate to Activities Page
manageActivitiesBtn.addEventListener('click', () => {
    console.log('📋 Redirecting to Manage Activities Page...');
    window.location.href = 'activities.html';
});

// 🗓️ Day Plan Data
let dayPlan = [];
let draggedActivity = null;
const activities = JSON.parse(localStorage.getItem('activities')) || [];

window.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Page Loaded: Initializing day planner...');

    // 🚨 Check if a selected day exists in localStorage
    if (!localStorage.getItem('selectedDay')) {
        console.warn('⚠️ No selectedDay found in localStorage. Redirecting to trip overview...');
        window.location.href = 'trip.html';
        return;
    }

    // 📝 Display Trip Details in Header
    loadTripDetailsInHeader();

    // 🛑 Hide activity modal initially
    if (activityTimeModal) activityTimeModal.style.display = 'none';

    // 🗓️ Generate Day Block
    generateDayBlock();

    // 📥 Load Existing Day Plan or Start Fresh
    const currentDayPlan = JSON.parse(localStorage.getItem('currentDayPlan'));

    if (currentDayPlan && currentDayPlan.dayPlan) {
        console.log('📥 Loading existing day plan for editing:', currentDayPlan);
        dayPlan = currentDayPlan.dayPlan;
        saveDayPlan();
        organizeDayPlan();
        updateTotalCost();
        localStorage.removeItem('currentDayPlan');
    } else {
        console.log('🧹 Starting with a clean day plan');
        dayPlan = [];
        saveDayPlan();
        organizeDayPlan();
    }

    // 📦 Load Activities
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
    const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || { dayPlans: {} };
    const selectedDay = localStorage.getItem('selectedDay');
    const people = tripDetails.people || 1;

    const totalCostPerPerson = dayPlan.reduce((sum, activity) => sum + activity.cost, 0);
    const totalCostForAllTravelers = totalCostPerPerson * people;

    tripDetails.dayPlans[selectedDay] = {
        dayPlan,
        totalCost: totalCostForAllTravelers
    };

    localStorage.setItem('tripDetails', JSON.stringify(tripDetails));
    console.log(`💾 Day Plan Saved for Day ${selectedDay}:`, tripDetails.dayPlans[selectedDay]);
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
    const startTime = activityStartTimeInput.value.trim();
    const endTime = activityEndTimeInput.value.trim();

    console.log(`🕒 Confirming Activity Time: Start - ${startTime}, End - ${endTime}`);

    if (!startTime || !endTime) {
        alert('❌ Please enter both start and end times.');
        return;
    }

    if (endTime <= startTime) {
        alert('❌ End time must be after start time.');
        return;
    }

    if (!draggedActivity) {
        console.error('❌ No activity selected.');
        return;
    }

    // Add activity with explicit start and end time
    addActivityToDayPlan(draggedActivity, startTime, endTime);

    // Reset modal state
    activityTimeModal.style.display = 'none';
    activityStartTimeInput.value = '';
    activityEndTimeInput.value = '';
    draggedActivity = null;

    console.log('✅ Activity added with Start and End Times.');
});

// ✅ Handle Cancel Button in Add Activity Modal
closeModalBtn.addEventListener('click', () => {
    console.log('❌ Cancelling Activity Time Modal');

    // Reset modal state
    activityTimeModal.style.display = 'none';
    activityTimeInput.value = '';
    draggedActivity = null; // Clear the dragged activity reference

    console.log('🔄 Modal reset and hidden successfully.');
});



finishPlanningBtn.addEventListener('click', () => {
    console.log('✅ Finishing Planning for the Day');

    const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || { days: 0, dayPlans: {} };
    const selectedDay = localStorage.getItem('selectedDay');
    const numberOfTravelers = tripDetails.people || 1;

    if (!selectedDay) {
        alert('❌ No day selected. Returning to trip overview.');
        window.location.href = 'trip.html';
        return;
    }

    if (!tripDetails.dayPlans) {
        tripDetails.dayPlans = {};
    }

    // Calculate the total cost for one traveler
    const totalCostPerPerson = dayPlan.reduce((sum, activity) => sum + activity.cost, 0);
    console.log(`💵 Total Cost Per Person: ${totalCostPerPerson}`);

    // Calculate total cost for all travelers
    const totalCostForAllTravelers = totalCostPerPerson * numberOfTravelers;
    console.log(`💵 Total Cost for All Travelers: ${totalCostForAllTravelers}`);

    // Store day plan with total cost for all travelers
    const currentDayPlan = {
        dayPlan,
        totalCost: totalCostForAllTravelers
    };

    tripDetails.dayPlans[selectedDay] = currentDayPlan;

    try {
        localStorage.setItem('tripDetails', JSON.stringify(tripDetails));
        console.log(`📅 Day ${selectedDay} updated successfully in tripDetails.`);
    } catch (e) {
        console.error('❌ Failed to save trip details to localStorage:', e);
        alert('❌ Failed to save trip details. Ensure storage is enabled.');
        return;
    }

    // Redirect to Trip Page
    window.location.href = 'trip.html';
});




// 📋 Create Individual Activity Item
function createActivityItem(activity) {
    console.log(`🎯 Creating Activity Item: ${activity.title}`);

    const activityItem = document.createElement('div');
    activityItem.classList.add('activity-item');
    activityItem.textContent = `${activity.title} - Cost Per Person: $${activity.cost.toFixed(2)}`;
    activityItem.draggable = true;
    activityItem.dataset.id = activity.id;

    // Add Drag Events
    activityItem.addEventListener('dragstart', handleDragStart);
    activityItem.addEventListener('dragend', handleDragEnd);

    activityPool.appendChild(activityItem);
}



// 🕒 Format Time to 12-Hour Format (AM/PM)
function formatTimeTo12Hour(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Handle 0 as 12
    return `${formattedHours}:${String(minutes).padStart(2, '0')} ${suffix}`;
}


// 🌟 Organize Day Plan with Costs Displayed
function organizeDayPlan() {
    console.log('🔄 Organizing Day Plan...');
    const dropZone = document.getElementById('activity-drop-zone');
    if (!dropZone) {
        console.error('❌ Drop Zone not found.');
        return;
    }

    dropZone.innerHTML = ''; // Clear the drop zone

    if (dayPlan.length === 0) {
        dropZone.innerHTML = `<p>Drag activities here to plan your day</p>`;
        console.log('ℹ️ Day Plan is empty. Showing default message.');
    } else {
        // Sort by start time for display order
        dayPlan.sort((a, b) => a.startTime.localeCompare(b.startTime));
        dayPlan.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.classList.add('scheduled-activity');
            activityElement.innerHTML = `
                <p>
                    <strong>${activity.title}</strong> 
                    (${formatTimeTo12Hour(activity.startTime)} - ${formatTimeTo12Hour(activity.endTime)}) 
                    - Cost Per Person: $${activity.cost.toFixed(2)}
                </p>
                <button class="delete-activity" data-id="${activity.id}">Delete</button>
            `;
            dropZone.appendChild(activityElement);

            const deleteButton = activityElement.querySelector('.delete-activity');
            deleteButton.addEventListener('click', () => deleteActivityFromDayPlan(activity.id));
        });

        console.log('✅ Day Plan organized successfully with 12-hour time format.');
    }

    updateTotalCost();
}



// 💰 Calculate and Display Total Cost
function updateTotalCost() {
    console.log('💰 Updating Total Cost...');

    const tripDetails = JSON.parse(localStorage.getItem('tripDetails')) || {};
    const people = tripDetails.people || 1; // Get the number of travelers from tripDetails

    // Calculate the total cost of all activities
    const totalCostPerPerson = dayPlan.reduce((sum, activity) => sum + activity.cost, 0);

    // Calculate total cost for all travelers
    const totalCostForAllTravelers = totalCostPerPerson * people;

    // Display costs in the DOM
    const totalCostElement = document.getElementById('total-cost-per-person');
    const totalCostAllTravelersElement = document.getElementById('total-cost-all-travelers');

    if (totalCostElement) {
        totalCostElement.textContent = `$${totalCostPerPerson.toFixed(2)}`;
        console.log(`💵 Total Cost Per Person Updated: $${totalCostPerPerson.toFixed(2)}`);
    } else {
        console.warn('⚠️ Total Cost Per Person element not found in DOM.');
    }

    if (totalCostAllTravelersElement) {
        totalCostAllTravelersElement.textContent = `$${totalCostForAllTravelers.toFixed(2)}`;
        console.log(`💵 Total Cost for All Travelers Updated: $${totalCostForAllTravelers.toFixed(2)}`);
    } else {
        console.warn('⚠️ Total Cost for All Travelers element not found in DOM.');
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

