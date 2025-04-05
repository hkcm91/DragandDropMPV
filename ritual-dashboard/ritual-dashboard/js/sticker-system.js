/**
 * Sticker system for Ritual Interactive System
 * Handles sticker loading, drag and drop, and interactions
 */
const StickerSystem = (function() {
    // Sticker data - in production this would be loaded from external files
    const stickerTypes = [
        {
            id: 'analytics',
            name: 'Analytics',
            icon: 'chart-line',
            image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
        },
        {
            id: 'calendar',
            name: 'Calendar',
            icon: 'calendar',
            image: 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png'
        },
        {
            id: 'weather',
            name: 'Weather',
            icon: 'cloud-sun',
            image: 'https://cdn-icons-png.flaticon.com/512/1146/1146869.png'
        },
        {
            id: 'notes',
            name: 'Notes',
            icon: 'sticky-note',
            image: 'https://cdn-icons-png.flaticon.com/512/3281/3281289.png'
        },
        {
            id: 'tasks',
            name: 'Tasks',
            icon: 'tasks',
            image: 'https://cdn-icons-png.flaticon.com/512/2838/2838784.png'
        },
        {
            id: 'chart',
            name: 'Chart',
            icon: 'chart-pie',
            image: 'https://cdn-icons-png.flaticon.com/512/1170/1170577.png'
        }
    ];
    
    // Cache DOM elements
    const stickerGrid = document.getElementById('sticker-grid');
    const canvas = document.getElementById('canvas');
    
    // Drag and drop tracking
    let draggedItem = null;
    let isDragging = false;
    let offsetX, offsetY;
    
    // Initialize sticker system
    function init() {
        // Load stickers into sidebar
        loadStickers();
        
        // Set up canvas drop area
        setupCanvas();
        
        // Restore saved stickers
        restoreSavedStickers();
    }
    
    // Load stickers into the sidebar
    function loadStickers() {
        stickerGrid.innerHTML = '';
        
        stickerTypes.forEach(sticker => {
            const stickerEl = document.createElement('div');
            stickerEl.className = 'sticker-item';
            stickerEl.setAttribute('draggable', 'true');
            stickerEl.setAttribute('data-type', sticker.id);
            
            stickerEl.innerHTML = `
                <img src="${sticker.image}" alt="${sticker.name}" width="50" height="50">
                <div class="sticker-icon"><i class="fas fa-${sticker.icon}"></i></div>
            `;
            
            // Set up drag events
            stickerEl.addEventListener('dragstart', handleDragStart);
            stickerEl.addEventListener('dragend', handleDragEnd);
            
            stickerGrid.appendChild(stickerEl);
        });
    }
    
    // Set up canvas drop area
    function setupCanvas() {
        canvas.addEventListener('dragover', e => e.preventDefault());
        canvas.addEventListener('drop', handleDrop);
    }
    
    // Restore stickers from saved state
    function restoreSavedStickers() {
        const savedStickers = StateAdapter.get('stickerPositions') || [];
        
        savedStickers.forEach(sticker => {
            createSticker(sticker.type, sticker.x, sticker.y);
        });
    }
    
    // Handle sticker drag start
    function handleDragStart(e) {
        draggedItem = this;
        setTimeout(() => this.style.opacity = '0.5', 0);
        
        const type = this.getAttribute('data-type');
        e.dataTransfer.setData('text/plain', type);
    }
    
    // Handle sticker drag end
    function handleDragEnd() {
        this.style.opacity = '1';
    }
    
    // Handle sticker drop on canvas
    function handleDrop(e) {
        e.preventDefault();
        
        const type = e.dataTransfer.getData('text/plain');
        if (!type) return;
        
        // Calculate position
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - 25; 
        const y = e.clientY - rect.top - 25;
        
        createSticker(type, x, y);
        UIComponents.showNotification(`${formatStickerName(type)} sticker added`);
    }
    
    // Create a sticker on the canvas
    function createSticker(type, x, y) {
        // Find sticker data
        const stickerData = stickerTypes.find(s => s.id === type) || stickerTypes[0];
        
        // Create sticker element
        const sticker = document.createElement('div');
        sticker.className = 'sticker-item draggable';
        sticker.dataset.type = type;
        
        // Set sticker content
        sticker.innerHTML = `
            <img src="${stickerData.image}" alt="${stickerData.name}" width="50" height="50">
            <div class="sticker-icon"><i class="fas fa-${stickerData.icon}"></i></div>
        `;
        
        // Position
        sticker.style.left = x + 'px';
        sticker.style.top = y + 'px';
        
        // Add to canvas
        canvas.appendChild(sticker);
        
        // Make draggable
        makeDraggable(sticker);
        
        // Make clickable
        sticker.addEventListener('click', function() {
            if (!isDragging) {
                UIComponents.showNotification(`${formatStickerName(type)} sticker clicked`);
                // In a real app, this would open the sticker's widget UI
            }
        });
        
        // Save position to state
        const newSticker = { type, x, y };
        StateAdapter.addToArray('stickerPositions', newSticker);
        
        return sticker;
    }
    
    // Make an element draggable on the canvas
    function makeDraggable(element) {
        element.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return; // Only left button
            
            isDragging = false;
            
            // Get initial positions
            const rect = this.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            
            // Prevent defaults
            e.preventDefault();
            
            // Store sticker reference and type
            const stickerType = this.getAttribute('data-type');
            const stickerElement = this;
            
            function onMouseMove(e) {
                isDragging = true;
                
                // Calculate new position
                const canvasRect = canvas.getBoundingClientRect();
                let x = e.clientX - canvasRect.left - offsetX;
                let y = e.clientY - canvasRect.top - offsetY;
                
                // Constrain to canvas
                x = Math.max(0, Math.min(x, canvasRect.width - element.offsetWidth));
                y = Math.max(0, Math.min(y, canvasRect.height - element.offsetHeight));
                
                // Set position
                stickerElement.style.left = x + 'px';
                stickerElement.style.top = y + 'px';
            }
            
            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                
                if (isDragging) {
                    // Update position in state
                    const x = parseInt(stickerElement.style.left);
                    const y = parseInt(stickerElement.style.top);
                    
                    // Find the sticker in state and update position
                    const positions = StateAdapter.get('stickerPositions') || [];
                    const index = positions.findIndex(s => 
                        s.type === stickerType && 
                        Math.abs(s.x - x) < 50 && 
                        Math.abs(s.y - y) < 50
                    );
                    
                    if (index !== -1) {
                        StateAdapter.updateInArray(
                            'stickerPositions',
                            (item, idx) => idx === index,
                            { x, y }
                        );
                    }
                    
                    UIComponents.showNotification('Sticker moved');
                }
                
                // Reset after a delay
                setTimeout(function() {
                    isDragging = false;
                }, 100);
            }
        });
    }
    
    // Format sticker name for display
    function formatStickerName(type) {
        const sticker = stickerTypes.find(s => s.id === type);
        return sticker ? sticker.name : type.charAt(0).toUpperCase() + type.slice(1);
    }
    
    // Public API
    return {
        init,
        createSticker,
        getStickerTypes: () => stickerTypes
    };
})();