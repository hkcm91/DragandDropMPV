/**
 * UI components for Ritual Interactive System
 * Handles sidebar, notifications and other UI elements
 */
const UIComponents = (function() {
    // Cache DOM elements
    const sidebar = document.getElementById('sidebar');
    const sidebarButton = document.getElementById('sidebar-button');
    const sidebarIcon = document.getElementById('sidebar-icon');
    const mainContent = document.getElementById('main-content');
    const notification = document.getElementById('notification');
    
    // Track sidebar state
    let sidebarOpen = false;
    
    // Initialize UI components
    function init() {
        // Set up sidebar toggle
        sidebarButton.addEventListener('click', toggleSidebar);
        
        // Load sidebar state from persistent storage
        const settings = StateAdapter.get('settings');
        if (settings && settings.sidebarOpen) {
            toggleSidebar();
        }
        
        // Demo: Show sidebar briefly on first load
        setTimeout(() => {
            if (!sidebarOpen) toggleSidebar();
            
            setTimeout(() => {
                if (sidebarOpen) toggleSidebar();
            }, 2000);
        }, 1000);
    }
    
    // Toggle sidebar visibility
    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
        
        if (sidebarOpen) {
            sidebar.style.left = '0';
            sidebarIcon.className = 'fas fa-chevron-left';
            mainContent.style.marginLeft = '240px';
            showNotification('Sticker tray opened');
        } else {
            sidebar.style.left = '-240px';
            sidebarIcon.className = 'fas fa-chevron-right';
            mainContent.style.marginLeft = '0';
        }
        
        // Save sidebar state
        const settings = StateAdapter.get('settings') || {};
        settings.sidebarOpen = sidebarOpen;
        StateAdapter.set('settings', settings);
    }
    
    // Show notification message
    function showNotification(message) {
        notification.textContent = message;
        notification.style.opacity = '1';
        
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 2000);
    }
    
    // Public API
    return {
        init,
        showNotification,
        toggleSidebar
    };
})();