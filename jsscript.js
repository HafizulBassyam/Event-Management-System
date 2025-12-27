let events = JSON.parse(localStorage.getItem("events")) || [];
let editingIndex = -1; // Track which event is being edited

// ===== TOAST NOTIFICATION SYSTEM =====
function showToast(message, type = "info") {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast-container');
  existingToasts.forEach(toast => toast.remove());
  
  // Create toast container
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  
  // Type colors mapping
  const typeColors = {
    success: '#06d6a0',
    warning: '#ff9e00',
    danger: '#ef476f',
    info: '#4361ee'
  };
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = 'toast show';
  toast.style.backgroundColor = typeColors[type] || typeColors.info;
  toast.style.color = 'white';
  toast.style.borderRadius = '10px';
  
  toast.innerHTML = `
    <div class="d-flex align-items-center">
      <div class="toast-body" style="flex: 1; padding: 15px 20px;">
        <strong>${type.charAt(0).toUpperCase() + type.slice(1)}!</strong> ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-3" style="background: transparent; border: none; font-size: 1.2rem;"></button>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  document.body.appendChild(toastContainer);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      if (toastContainer.parentNode) {
        toastContainer.remove();
      }
    }, 300);
  }, 3000);
  
  // Add close functionality
  toast.querySelector('.btn-close').addEventListener('click', () => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      if (toastContainer.parentNode) {
        toastContainer.remove();
      }
    }, 300);
  });
}

// ===== LOGIN FUNCTION =====
function login() {
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;
  
  // Basic email validation
  if (!email.includes('@') || !email.includes('.')) {
    showToast("Please enter a valid email address", "warning");
    return false;
  }
  
  // Password length check
  if (password.length < 6) {
    showToast("Password must be at least 6 characters", "warning");
    return false;
  }
  
  if (email === "admin@example.com" && password === "admin123") {
    // Store login timestamp
    localStorage.setItem("loginTime", new Date().toISOString());
    showToast("Login successful! Redirecting...", "success");
    
    // Delay redirect to show toast
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
    
    return false;
  } else {
    showToast("Invalid credentials. Use admin@example.com / admin123", "danger");
    return false;
  }
}

// ===== DISPLAY EVENTS =====
function displayEvents() {
  let table = document.getElementById("eventTable");
  if (!table) return; // Exit if table doesn't exist on current page
  
  table.innerHTML = "";

  if (events.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4 text-muted">
          <i>No events found. Add your first event!</i>
        </td>
      </tr>
    `;
    return;
  }

  events.forEach((event, index) => {
    // Format date for display
    const formattedDate = formatDate(event.date);
    
    table.innerHTML += `
      <tr>
        <td><strong>${event.name}</strong></td>
        <td>${formattedDate}</td>
        <td>${event.location}</td>
        <td>
          <span class="badge ${event.status === "Upcoming" ? "bg-success" : "bg-secondary"}">
            ${event.status}
          </span>
        </td>
        <td>
          <button class="btn btn-info btn-sm me-1" onclick="viewEventDetails(${index})" title="View Details">
            View
          </button>
          <button class="btn btn-warning btn-sm me-1" onclick="editEvent(${index})" title="Edit Event">
            Edit
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteEvent(${index})" title="Delete Event">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
  
  // Update dashboard stats if on dashboard page
  updateDashboardStats();
}

// ===== ADD EVENT =====
function addEvent() {
  // If we're in edit mode, update instead
  if (editingIndex !== -1) {
    updateEvent();
    return;
  }
  
  let name = document.getElementById("eventName").value.trim();
  let date = document.getElementById("eventDate").value;
  let location = document.getElementById("eventLocation").value.trim();
  let status = document.getElementById("eventStatus").value;

  // Validation checks
  if (name === "") {
    showToast("Event name is required", "warning");
    document.getElementById("eventName").focus();
    return;
  }
  
  if (name.length < 3) {
    showToast("Event name must be at least 3 characters", "warning");
    return;
  }
  
  if (date === "") {
    showToast("Event date is required", "warning");
    return;
  }
  
  // Check if date is in the past for upcoming events
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (status === "Upcoming" && selectedDate < today) {
    if (!confirm("Selected date is in the past. Still mark as Upcoming?")) {
      return;
    }
  }
  
  if (location === "") {
    showToast("Event location is required", "warning");
    return;
  }

  // Check for duplicate events
  const isDuplicate = events.some(event => 
    event.name.toLowerCase() === name.toLowerCase() && 
    event.date === date
  );
  
  if (isDuplicate) {
    showToast("An event with the same name and date already exists", "warning");
    return;
  }

  // Add event to array
  events.push({ name, date, location, status });
  
  // Save to localStorage
  localStorage.setItem("events", JSON.stringify(events));
  
  // Clear form fields
  document.getElementById("eventName").value = "";
  document.getElementById("eventDate").value = "";
  document.getElementById("eventLocation").value = "";
  document.getElementById("eventStatus").value = "Upcoming";
  
  // Refresh event display
  displayEvents();
  
  // Show success message
  showToast("Event added successfully!", "success");
  
  // Scroll to event list
  const eventList = document.querySelector('h3');
  if (eventList) {
    eventList.scrollIntoView({ behavior: 'smooth' });
  }
}

// ===== EDIT EVENT =====
function editEvent(index) {
  editingIndex = index;
  const event = events[index];
  
  // Populate form with event data
  document.getElementById("eventName").value = event.name;
  document.getElementById("eventDate").value = event.date;
  document.getElementById("eventLocation").value = event.location;
  document.getElementById("eventStatus").value = event.status;
  
  // Change button text and function
  const addButton = document.querySelector('.btn-primary.w-100');
  if (addButton) {
    addButton.innerText = "Update Event";
    addButton.classList.remove('btn-primary');
    addButton.classList.add('btn-warning');
    addButton.setAttribute('onclick', 'updateEvent()');
  }
  
  // Add cancel button if not exists
  if (!document.getElementById('cancelEditBtn')) {
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelEditBtn';
    cancelBtn.className = 'btn btn-secondary w-100 mt-2';
    cancelBtn.innerHTML = '<i>Cancel Edit</i>';
    cancelBtn.onclick = cancelEdit;
    
    const formCard = document.querySelector('.card.p-3.shadow.mb-4');
    if (formCard) {
      formCard.querySelector('.row').nextElementSibling?.remove();
      const cancelDiv = document.createElement('div');
      cancelDiv.className = 'row mt-2';
      cancelDiv.innerHTML = '<div class="col-md-12"></div>';
      cancelDiv.querySelector('.col-md-12').appendChild(cancelBtn);
      formCard.appendChild(cancelDiv);
    }
  }
  
  // Scroll to form and focus
  document.getElementById("eventName").scrollIntoView({ behavior: 'smooth' });
  document.getElementById("eventName").focus();
  
  showToast(`Editing: ${event.name}`, "info");
}

// ===== UPDATE EVENT =====
function updateEvent() {
  if (editingIndex === -1) {
    showToast("No event selected for editing", "warning");
    return;
  }
  
  let name = document.getElementById("eventName").value.trim();
  let date = document.getElementById("eventDate").value;
  let location = document.getElementById("eventLocation").value.trim();
  let status = document.getElementById("eventStatus").value;

  // Validation
  if (name === "" || date === "" || location === "") {
    showToast("Please fill in all fields", "warning");
    return;
  }

  // Update event
  const oldEventName = events[editingIndex].name;
  events[editingIndex] = { name, date, location, status };
  
  // Save to localStorage
  localStorage.setItem("events", JSON.stringify(events));
  
  // Reset form
  cancelEdit();
  
  // Refresh display
  displayEvents();
  
  showToast(`Event "${oldEventName}" updated successfully!`, "success");
}

// ===== CANCEL EDIT =====
function cancelEdit() {
  editingIndex = -1;
  
  // Clear form
  document.getElementById("eventName").value = "";
  document.getElementById("eventDate").value = "";
  document.getElementById("eventLocation").value = "";
  document.getElementById("eventStatus").value = "Upcoming";
  
  // Reset button
  const addButton = document.querySelector('.btn-primary.w-100, .btn-warning.w-100');
  if (addButton) {
    addButton.innerText = "Add Event";
    addButton.classList.remove('btn-warning');
    addButton.classList.add('btn-primary');
    addButton.setAttribute('onclick', 'addEvent()');
  }
  
  // Remove cancel button and its container
  const cancelBtn = document.getElementById('cancelEditBtn');
  if (cancelBtn) {
    const cancelContainer = cancelBtn.closest('.row.mt-2');
    if (cancelContainer) {
      cancelContainer.remove();
    }
  }
  
  showToast("Edit cancelled", "info");
}

// ===== DELETE EVENT =====
function deleteEvent(index) {
  const eventName = events[index].name;
  
  if (confirm(`Are you sure you want to delete "${eventName}"?`)) {
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    displayEvents();
    showToast(`Event "${eventName}" deleted successfully!`, "success");
    
    // If we were editing this event, cancel edit mode
    if (editingIndex === index) {
      cancelEdit();
    }
  }
}

// ===== VIEW EVENT DETAILS =====
function viewEventDetails(index) {
  localStorage.setItem("selectedEvent", index);
  window.location.href = "event-details.html";
}

// ===== UPDATE DASHBOARD STATS =====
function updateDashboardStats() {
  // Only run if on dashboard page
  if (document.getElementById("totalEvents")) {
    document.getElementById("totalEvents").innerText = events.length;
    document.getElementById("upcomingEvents").innerText = 
      events.filter(e => e.status === "Upcoming").length;
    document.getElementById("completedEvents").innerText = 
      events.filter(e => e.status === "Completed").length;
  }
}

// ===== FORMAT DATE =====
function formatDate(dateString) {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

// ===== INITIALIZE PAGE =====
document.addEventListener('DOMContentLoaded', function() {
  // Check for edit index from dashboard
  const editIndex = localStorage.getItem("editEventIndex");
  if (editIndex !== null && !isNaN(editIndex)) {
    editEvent(parseInt(editIndex));
    localStorage.removeItem("editEventIndex");
  }
  
  // Check which page we're on and initialize accordingly
  if (window.location.pathname.includes("events.html") || 
      window.location.pathname.endsWith("events.html") ||
      document.getElementById("eventTable")) {
    displayEvents();
    
    // Setup Enter key support
    document.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        // Check if we're in an input field in the event form
        if (e.target.matches('#eventName, #eventDate, #eventLocation, #eventStatus')) {
          if (editingIndex !== -1) {
            updateEvent();
          } else {
            addEvent();
          }
        }
      }
    });
  }
  
  if (window.location.pathname.includes("dashboard.html") || 
      window.location.pathname.endsWith("dashboard.html") ||
      document.getElementById("totalEvents")) {
    updateDashboardStats();
  }
});