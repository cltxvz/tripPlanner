// 🚀 Trip Form Submission
document.getElementById('trip-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const destination = document.getElementById('destination').value;
  const days = parseInt(document.getElementById('days').value, 10);
  const people = parseInt(document.getElementById('people').value, 10);

  if (destination && days > 0 && people > 0) {
    localStorage.setItem('tripDetails', JSON.stringify({ destination, days, people }));
    window.location.href = 'trip.html';
  } else {
    alert('Please fill all fields correctly.');
  }
});

// 📥 Import Trip Functionality
const importTripBtn = document.getElementById('import-trip-btn');

importTripBtn.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.addEventListener('change', handleTripImport);
  input.click();
});

// 📥 Handle Import Trip Data
function handleTripImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
      try {
          const tripData = JSON.parse(e.target.result);

          // Validate JSON Structure
          if (!tripData.tripDetails || !tripData.activities) {
              throw new Error('Invalid trip file format');
          }

          // Validate Required Trip Details
          const { destination, days, people } = tripData.tripDetails;
          if (!destination || days <= 0 || people <= 0) {
              throw new Error('Invalid trip details in file');
          }

          // Save Data to LocalStorage
          localStorage.setItem('tripDetails', JSON.stringify(tripData.tripDetails));
          localStorage.setItem('activities', JSON.stringify(tripData.activities));

          alert('✅ Trip imported successfully! Redirecting to Trip Overview...');
          window.location.href = 'trip.html';

      } catch (error) {
          console.error('❌ Import failed:', error.message);
          alert('❌ Invalid file format. Please upload a valid trip JSON file.');
      }
  };

  reader.readAsText(file);
}
