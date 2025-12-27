let events = JSON.parse(localStorage.getItem("events")) || [];

// ===== INITIALIZE DASHBOARD STATS =====
document.addEventListener('DOMContentLoaded', function() {
  refreshDashboardStats();
});

function refreshDashboardStats() {
  events = JSON.parse(localStorage.getItem("events")) || [];
  
  document.getElementById("totalEvents").innerText = events.length;
  document.getElementById("upcomingEvents").innerText =
    events.filter(e => e.status === "Upcoming").length;
  document.getElementById("completedEvents").innerText =
    events.filter(e => e.status === "Completed").length;
}

// ===== SHOW ALL EVENTS =====
function showAllEvents() {
  const filteredEvents = events;
  displayEventTable(filteredEvents, "All Events");
}

// ===== SHOW UPCOMING EVENTS =====
function showUpcomingEvents() {
  const filteredEvents = events.filter(e => e.status === "Upcoming");
  displayEventTable(filteredEvents, "Upcoming Events");
}

// ===== SHOW COMPLETED EVENTS =====
function showCompletedEvents() {
  const filteredEvents = events.filter(e => e.status === "Completed");
  displayEventTable(filteredEvents, "Completed Events");
}

// ===== DISPLAY EVENTS IN TABLE =====
function displayEventTable(eventList, title) {
  const tableBody = document.getElementById("dashboardEventTable");
  const sectionTitle = document.getElementById("sectionTitle");
  const eventDetailsSection = document.getElementById("eventDetailsSection");
  
  // Set title
  sectionTitle.innerText = `${title} (${eventList.length})`;
  
  // Clear existing rows
  tableBody.innerHTML = "";
  
  if (eventList.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted py-4">
          <i>No events found.</i>
        </td>
      </tr>
    `;
  } else {
    // Add events to table
    eventList.forEach((event, listIndex) => {
      // Find the original index in the main events array
      const originalIndex = events.findIndex(e => 
        e.name === event.name && 
        e.date === event.date && 
        e.location === event.location
      );
      
      tableBody.innerHTML += `
        <tr>
          <td><strong>${event.name}</strong></td>
          <td>${formatDate(event.date)}</td>
          <td>${event.location}</td>
          <td>
            <span class="badge ${event.status === "Upcoming" ? "bg-success" : "bg-secondary"}">
              ${event.status}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-info me-1" onclick="viewEventFromDashboard(${originalIndex})" title="View Details">
              View
            </button>
            <button class="btn btn-sm btn-warning me-1" onclick="editEventFromDashboard(${originalIndex})" title="Edit Event">
              Edit
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteEventFromDashboard(${originalIndex})" title="Delete Event">
              Delete
            </button>
          </td>
        </tr>
      `;
    });
  }
  
  // Show the event details section
  eventDetailsSection.style.display = "block";
  
  // Scroll to the section
  eventDetailsSection.scrollIntoView({ behavior: 'smooth' });
}

// ===== HIDE EVENT DETAILS =====
function hideEventDetails() {
  const eventDetailsSection = document.getElementById("eventDetailsSection");
  eventDetailsSection.style.display = "none";
}

// ===== VIEW EVENT FROM DASHBOARD =====
function viewEventFromDashboard(index) {
  if (index >= 0 && index < events.length) {
    localStorage.setItem("selectedEvent", index);
    window.location.href = "event-details.html";
  }
}

// ===== EDIT EVENT FROM DASHBOARD =====
function editEventFromDashboard(index) {
  if (index >= 0 && index < events.length) {
    localStorage.setItem("editEventIndex", index);
    window.location.href = "events.html";
  }
}

// ===== DELETE EVENT FROM DASHBOARD =====
function deleteEventFromDashboard(index) {
  if (index < 0 || index >= events.length) return;
  
  const eventName = events[index].name;
  
  if (confirm(`Are you sure you want to delete "${eventName}"?`)) {
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    
    // Update dashboard stats
    refreshDashboardStats();
    
    // Refresh the current view
    const currentTitle = document.getElementById("sectionTitle").innerText;
    if (currentTitle.includes("All Events")) {
      showAllEvents();
    } else if (currentTitle.includes("Upcoming")) {
      showUpcomingEvents();
    } else if (currentTitle.includes("Completed")) {
      showCompletedEvents();
    }
    
    // Show success message
    showToast(`Event "${eventName}" deleted successfully!`, "success");
  }
}

// ===== FORMAT DATE HELPER =====
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

// ===== TOAST FUNCTION FOR DASHBOARD =====
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