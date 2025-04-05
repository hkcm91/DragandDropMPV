/**
 * Main application entry point for Ritual Interactive System
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded: Initializing Ritual Interactive System');
    
    // Initialize components in the correct order
    try {
        // Initialize state first
        StateAdapter.get(); // Initialize state
        console.log('State adapter initialized');
        
        // Initialize UI components
        UIComponents.init();
        console.log('UI components initialized');
        
        // Initialize sticker system last (depends on UI and State)
        StickerSystem.init();
        console.log('Sticker system initialized');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
    
    // Log startup
    console.log('Ritual Interactive System fully initialized');
});