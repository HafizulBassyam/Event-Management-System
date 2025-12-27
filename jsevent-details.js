let events = JSON.parse(localStorage.getItem("events")) || [];
let indexString = localStorage.getItem("selectedEvent");

// Convert string to number
let index = indexString !== null ? parseInt(indexString) : null;

// Get DOM elements safely
let eventTitle = document.getElementById("eventTitle");
let eventDate = document.getElementById("eventDate");
let eventLocation = document.getElementById("eventLocation");
let eventStatus = document.getElementById("eventStatus");

// Check if index is valid and event exists
if (index !== null && !isNaN(index) && index >= 0 && index < events.length) {
  let event = events[index];
  
  // Display event details
  if (eventTitle) eventTitle.innerText = event.name;
  if (eventDate) eventDate.innerText = formatDate(event.date);
  if (eventLocation) eventLocation.innerText = event.location;
  
  if (eventStatus) {
    eventStatus.innerText = event.status;
    eventStatus.classList.add(
      event.status === "Upcoming" ? "bg-success" : "bg-secondary"
    );
  }
} else {
  // Redirect back if no event selected
  alert("Event not found! Redirecting back to events page.");
  window.location.href = "events.html";
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}