// Search functionality for the roadmap
document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
});

function setupSearch() {
    const searchInput = document.getElementById('roadmap-search');
    const searchButton = document.getElementById('search-button');
    
    if (!searchInput || !searchButton) return;
    
    // Add event listeners
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    // Add animation to search button
    searchButton.addEventListener('mouseenter', () => {
        anime({
            targets: searchButton,
            scale: 1.1,
            duration: 300,
            easing: 'easeOutQuad'
        });
    });
    
    searchButton.addEventListener('mouseleave', () => {
        anime({
            targets: searchButton,
            scale: 1,
            duration: 300,
            easing: 'easeOutQuad'
        });
    });
    
    // Initialize search tooltip
    searchButton.setAttribute('title', 'Search Roadmap');
}

function performSearch(query) {
    if (!query || query.trim() === '') return;
    
    // Clear previous highlights
    clearHighlights();
    
    // Convert query to lowercase for case-insensitive search
    const searchTerm = query.trim().toLowerCase();
    
    // Elements to search within
    const phaseTitles = document.querySelectorAll('.phase-title');
    const taskItems = document.querySelectorAll('.task-item');
    const phaseDetails = document.querySelectorAll('.phase-details');
    
    // Track if we found any matches
    let matchesFound = 0;
    let firstMatchElement = null;
    
    // Search in phase titles
    phaseTitles.forEach(title => {
        const text = title.textContent;
        if (text.toLowerCase().includes(searchTerm)) {
            highlightText(title, searchTerm);
            matchesFound++;
            
            // Store the first match for scrolling
            if (!firstMatchElement) {
                firstMatchElement = title.closest('.timeline-phase');
            }
        }
    });
    
    // Search in task items
    taskItems.forEach(task => {
        const text = task.textContent;
        if (text.toLowerCase().includes(searchTerm)) {
            highlightText(task, searchTerm);
            matchesFound++;
            
            // Store the first match for scrolling
            if (!firstMatchElement) {
                firstMatchElement = task.closest('.timeline-phase');
            }
            
            // Expand the card if it contains a match
            const card = task.closest('.phase-card');
            const detailsButton = card.querySelector('.expand-details-btn');
            const details = card.querySelector('.phase-details');
            
            if (details && details.classList.contains('hidden') && detailsButton) {
                // Simulate a click on the details button
                detailsButton.click();
            }
        }
    });
    
    // Search in phase details
    phaseDetails.forEach(details => {
        const text = details.textContent;
        if (text.toLowerCase().includes(searchTerm)) {
            highlightText(details, searchTerm);
            matchesFound++;
            
            // Store the first match for scrolling
            if (!firstMatchElement) {
                firstMatchElement = details.closest('.timeline-phase');
            }
            
            // Expand the details if they contain a match
            if (details.classList.contains('hidden')) {
                const card = details.closest('.phase-card');
                const detailsButton = card.querySelector('.expand-details-btn');
                
                if (detailsButton) {
                    // Simulate a click on the details button
                    detailsButton.click();
                }
            }
        }
    });
    
    // Scroll to the first match
    if (firstMatchElement) {
        firstMatchElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Add a pulse animation to the first match
        anime({
            targets: firstMatchElement,
            boxShadow: [
                '0 0 0 rgba(0, 243, 255, 0)',
                '0 0 20px rgba(0, 243, 255, 0.5)',
                '0 0 0 rgba(0, 243, 255, 0)'
            ],
            duration: 1500,
            easing: 'easeOutQuad'
        });
    }
    
    // Show search results feedback
    showSearchFeedback(matchesFound, searchTerm);
}

function highlightText(element, searchTerm) {
    const html = element.innerHTML;
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    
    // Replace matching text with highlighted version
    element.innerHTML = html.replace(regex, '<span class="search-highlight">$1</span>');
}

function clearHighlights() {
    // Remove all highlight spans
    document.querySelectorAll('.search-highlight').forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize(); // Merge adjacent text nodes
    });
    
    // Remove any search feedback
    const oldFeedback = document.querySelector('.search-feedback');
    if (oldFeedback) {
        oldFeedback.remove();
    }
}

function showSearchFeedback(count, term) {
    // Remove any existing feedback
    const oldFeedback = document.querySelector('.search-feedback');
    if (oldFeedback) {
        oldFeedback.remove();
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'search-feedback';
    
    if (count > 0) {
        feedback.innerHTML = `Found <span class="search-count">${count}</span> matches for "${term}"`;
        feedback.classList.add('search-success');
    } else {
        feedback.innerHTML = `No matches found for "${term}"`;
        feedback.classList.add('search-error');
    }
    
    // Add styles
    feedback.style.position = 'fixed';
    feedback.style.top = '80px';
    feedback.style.right = '20px';
    feedback.style.background = count > 0 ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255, 100, 100, 0.1)';
    feedback.style.border = count > 0 ? '1px solid var(--neon-blue)' : '1px solid #ff6464';
    feedback.style.color = count > 0 ? 'var(--neon-blue)' : '#ff6464';
    feedback.style.padding = '0.5rem 1rem';
    feedback.style.borderRadius = '4px';
    feedback.style.zIndex = '1000';
    feedback.style.boxShadow = count > 0 ? '0 0 10px rgba(0, 243, 255, 0.3)' : '0 0 10px rgba(255, 100, 100, 0.3)';
    feedback.style.fontFamily = "'Share Tech Mono', monospace";
    feedback.style.fontSize = '0.9rem';
    
    // Add to body
    document.body.appendChild(feedback);
    
    // Animate in
    anime({
        targets: feedback,
        translateX: [50, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutQuad'
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        anime({
            targets: feedback,
            translateX: [0, 50],
            opacity: [1, 0],
            duration: 500,
            easing: 'easeInQuad',
            complete: function() {
                feedback.remove();
            }
        });
    }, 5000);
}

// Helper function to escape special characters in regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
