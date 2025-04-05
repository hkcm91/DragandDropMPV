/**
 * Main application entry point for Ritual Interactive System
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    StateAdapter.get(); // Initialize state
    UIComponents.init();
    StickerSystem.init();
    
    // Log startup
    console.log('Ritual Interactive System initialized');
});