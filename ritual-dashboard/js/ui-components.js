/**
 * UI components for Ritual Interactive System
 * Simplified version based on working original code
 */
const UIComponents = (function() {
    // Track sidebar state
    let sidebarOpen = false;
    
    // Initialize UI components
    function init() {
        const sidebarButton = document.getElementById('sidebar-button');
        
        // Set up sidebar toggle - direct from original working code
        sidebarButton.addEventListener('click', toggleSidebar);
        
        // Demo: Show sidebar briefly on first load
        setTimeout(() => {
            if (!sidebarOpen) toggleSidebar();
            
            setTimeout(() => {
                if (sidebarOpen) toggleSidebar();
            }, 2000);
        }, 1000);
    }
    
    // Toggle sidebar visibility - direct from original working code
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarIcon = document.getElementById('sidebar-icon');
        const mainContent = document.getElementById('main-content');
        
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
    }
    
    // Show notification message - direct from original working code
    function showNotification(message) {
        const notification = document.getElementById('notification');
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