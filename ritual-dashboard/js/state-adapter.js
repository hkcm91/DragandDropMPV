/**
 * State management for Ritual Interactive System
 * Serves as the adapter between UI and persistent storage
 */
const StateAdapter = (function() {
    // Internal state cache
    let stateCache = {};
    
    // Load initial state
    function loadState() {
        try {
            // In production, this would load from a file or localStorage
            const savedState = localStorage.getItem('ritualState');
            if (savedState) {
                stateCache = JSON.parse(savedState);
            } else {
                // Initialize with defaults if no saved state
                stateCache = {
                    stickerPositions: [],
                    settings: {
                        theme: 'default',
                        sidebarOpen: false
                    }
                };
            }
        } catch (error) {
            console.error('Failed to load state:', error);
            // Initialize with defaults if loading fails
            stateCache = {
                stickerPositions: [],
                settings: {
                    theme: 'default',
                    sidebarOpen: false
                }
            };
        }
        return stateCache;
    }
    
    // Save state
    function saveState() {
        try {
            localStorage.setItem('ritualState', JSON.stringify(stateCache));
            // In production, also save to file system
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }
    
    // Public API
    return {
        // Get a value from state
        get: function(key) {
            if (!Object.keys(stateCache).length) {
                loadState();
            }
            return key ? stateCache[key] : stateCache;
        },
        
        // Set a value in state
        set: function(key, value) {
            stateCache[key] = value;
            saveState();
            return value;
        },
        
        // Add an item to an array in state
        addToArray: function(arrayKey, item) {
            if (!stateCache[arrayKey]) {
                stateCache[arrayKey] = [];
            }
            stateCache[arrayKey].push(item);
            saveState();
            return stateCache[arrayKey];
        },
        
        // Remove an item from an array in state
        removeFromArray: function(arrayKey, predicate) {
            if (!stateCache[arrayKey]) return [];
            stateCache[arrayKey] = stateCache[arrayKey].filter(item => !predicate(item));
            saveState();
            return stateCache[arrayKey];
        },
        
        // Update an item in an array
        updateInArray: function(arrayKey, predicate, updates) {
            if (!stateCache[arrayKey]) return [];
            stateCache[arrayKey] = stateCache[arrayKey].map(item => {
                if (predicate(item)) {
                    return { ...item, ...updates };
                }
                return item;
            });
            saveState();
            return stateCache[arrayKey];
        },
        
        // Clear all state (for testing)
        clear: function() {
            stateCache = {};
            saveState();
        }
    };
})();