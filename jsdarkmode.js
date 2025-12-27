// ===== DARK MODE FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
  initDarkMode();
});

function initDarkMode() {
  const darkMode = localStorage.getItem('darkMode');
  
  if (darkMode === 'enabled') {
    enableDarkMode();
  }
  
  createDarkModeToggle();
}

function createDarkModeToggle() {
  if (document.getElementById('darkModeToggle')) return;
 
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'darkModeToggle';
  toggleBtn.className = 'btn btn-outline-light btn-sm';
  toggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.bottom = '20px';
  toggleBtn.style.right = '20px';
  toggleBtn.style.zIndex = '1000';
  toggleBtn.style.borderRadius = '50%';
  toggleBtn.style.width = '50px';
  toggleBtn.style.height = '50px';
  toggleBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
  toggleBtn.title = 'Toggle Dark Mode';
 
  toggleBtn.addEventListener('click', toggleDarkMode);

  document.body.appendChild(toggleBtn);
}

function toggleDarkMode() {
  const darkMode = localStorage.getItem('darkMode');
  
  if (darkMode !== 'enabled') {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
}

function enableDarkMode() {
  document.documentElement.setAttribute('data-bs-theme', 'dark');

  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
    toggleBtn.className = 'btn btn-outline-warning btn-sm';
  }

  applyCustomDarkStyles();
 
  localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
  document.documentElement.removeAttribute('data-bs-theme');

  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
    toggleBtn.className = 'btn btn-outline-light btn-sm';
  }

  removeCustomDarkStyles();

  localStorage.setItem('darkMode', 'disabled');
}

function applyCustomDarkStyles() {
  let styleEl = document.getElementById('customDarkModeStyles');
  
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'customDarkModeStyles';
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    [data-bs-theme="dark"] {
      background-color: #1a1a1a;
      color: #e9ecef;
    }
    
    [data-bs-theme="dark"] .card {
      background-color: #2d2d2d;
      border-color: #404040;
    }
    
    [data-bs-theme="dark"] .calendar-container {
      background-color: #2d2d2d;
    }
    
    [data-bs-theme="dark"] .calendar-day {
      background-color: #3a3a3a;
      color: #e9ecef;
    }
    
    [data-bs-theme="dark"] .calendar-day.empty {
      background-color: transparent;
    }
    
    [data-bs-theme="dark"] .day-number {
      color: #e9ecef;
      border-bottom-color: #505050;
    }
    
    [data-bs-theme="dark"] .event-item {
      background-color: #404040;
      color: #e9ecef;
    }
    
    [data-bs-theme="dark"] .event-title {
      color: #e9ecef;
    }
    
    [data-bs-theme="dark"] .calendar-weekdays {
      color: #6ea8fe;
    }
    
    [data-bs-theme="dark"] .calendar-header {
      border-bottom-color: #404040;
    }
    
    [data-bs-theme="dark"] .calendar-legend {
      border-top-color: #404040;
    }
    
    [data-bs-theme="dark"] .table {
      color: #e9ecef;
    }
    
    [data-bs-theme="dark"] .table-bordered {
      border-color: #404040;
    }
    
    [data-bs-theme="dark"] .table-bordered th,
    [data-bs-theme="dark"] .table-bordered td {
      border-color: #404040;
    }
    
    [data-bs-theme="dark"] .form-control,
    [data-bs-theme="dark"] .form-select {
      background-color: #3a3a3a;
      border-color: #505050;
      color: #e9ecef;
    }
    
    [data-bs-theme="dark"] .form-control:focus,
    [data-bs-theme="dark"] .form-select:focus {
      background-color: #404040;
      border-color: #6ea8fe;
      color: #e9ecef;
    }
    
    [data-bs-theme="dark"] .modal-content {
      background-color: #2d2d2d;
      color: #e9ecef;
    }
    
    [data-bs-theme="dark"] .modal-header {
      border-bottom-color: #404040;
    }
    
    [data-bs-theme="dark"] .modal-footer {
      border-top-color: #404040;
    }
    
    [data-bs-theme="dark"] .clickable-card:hover {
      box-shadow: 0 10px 20px rgba(255,255,255,0.1) !important;
    }
    
    [data-bs-theme="dark"] footer {
      background-color: #1a1a1a !important;
    }
    
    [data-bs-theme="dark"] .login-page {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    }
    
    [data-bs-theme="dark"] .text-muted {
      color: #adb5bd !important;
    }
  `;
}

function removeCustomDarkStyles() {
  const styleEl = document.getElementById('customDarkModeStyles');
  if (styleEl) {
    styleEl.remove();
  }
}