document.addEventListener('DOMContentLoaded', () => {
  const tripDetails = JSON.parse(localStorage.getItem('tripDetails'));
  const savedActivities = JSON.parse(localStorage.getItem('activities')) || [];
  const calendar = document.getElementById('calendar');
  const activityPool = document.getElementById('activity-pool');

  // 🗓️ Populate Trip Plan
  if (tripDetails) {
      document.getElementById('trip-info').innerText = 
          `Destination: ${tripDetails.destination} | Days: ${tripDetails.days} | People: ${tripDetails.people}`;
      
      for (let i = 1; i <= tripDetails.days; i++) {
          calendar.innerHTML += `
              <div class="day" ondrop="drop(event)" ondragover="allowDrop(event)">
                  <h3>Day ${i}</h3>
                  <div class="day-activities"></div>
                  <div class="day-cost">Total Cost: $0.00</div>
              </div>`;
      }
  } else {
      window.location.href = 'index.html';
  }

  // 🛠️ Populate Available Activities
  function displayActivities() {
      activityPool.innerHTML = ''; // Clear before rendering

      savedActivities.forEach(activity => {
          const activityItem = document.createElement('div');
          activityItem.classList.add('activity-item');
          activityItem.setAttribute('draggable', 'true');
          activityItem.setAttribute('data-id', activity.id);
          activityItem.innerHTML = `
              <h4>${activity.title}</h4>
              <p><strong>Duration:</strong> ${activity.duration} hours</p>
              <p><strong>Cost:</strong> $${activity.cost.toFixed(2)}</p>
          `;
          activityItem.addEventListener('dragstart', drag);
          activityPool.appendChild(activityItem);
      });
  }

  displayActivities();
});

// 🛠️ Drag and Drop Functions
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData('activityId', event.target.getAttribute('data-id'));
}

function drop(event) {
  event.preventDefault();
  const activityId = event.dataTransfer.getData('activityId');
  const savedActivities = JSON.parse(localStorage.getItem('activities')) || [];
  const droppedActivity = savedActivities.find(activity => activity.id === parseInt(activityId));

  if (droppedActivity) {
      const dayActivities = event.target.closest('.day').querySelector('.day-activities');
      const activityItem = document.createElement('div');
      activityItem.classList.add('activity-assigned');
      activityItem.innerHTML = `
          <p><strong>${droppedActivity.title}</strong></p>
          <p>Duration: ${droppedActivity.duration} hours</p>
          <p>Cost: $${droppedActivity.cost.toFixed(2)}</p>
      `;
      dayActivities.appendChild(activityItem);

      updateDayCost(event.target.closest('.day'));
  }
}

// 🧮 Update Total Cost for Day
function updateDayCost(dayElement) {
  const activityItems = dayElement.querySelectorAll('.activity-assigned');
  let totalCost = 0;

  activityItems.forEach(item => {
      const costText = item.querySelector('p:last-child').innerText;
      const cost = parseFloat(costText.replace('Cost: $', '')) || 0;
      totalCost += cost;
  });

  dayElement.querySelector('.day-cost').innerText = `Total Cost: $${totalCost.toFixed(2)}`;
}
