document.addEventListener('DOMContentLoaded', () => {
    const tripDetails = JSON.parse(localStorage.getItem('tripDetails'));
  
    if (tripDetails) {
      document.getElementById('trip-info').innerText = 
        `Destination: ${tripDetails.destination} | Days: ${tripDetails.days} | People: ${tripDetails.people}`;
      
      const calendar = document.getElementById('calendar');
      for (let i = 1; i <= tripDetails.days; i++) {
        calendar.innerHTML += `<div class="day">Day ${i}</div>`;
      }
    } else {
      window.location.href = 'index.html';
    }
  });
  