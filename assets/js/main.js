document.getElementById('trip-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const destination = document.getElementById('destination').value;
    const days = parseInt(document.getElementById('days').value, 10);
    const people = parseInt(document.getElementById('people').value, 10);
  
    if (destination && days > 0 && people > 0) {
      localStorage.setItem('tripDetails', JSON.stringify({ destination, days, people }));
      window.location.href = 'calendar.html';
    } else {
      alert('Please fill all fields correctly.');
    }
  });
  