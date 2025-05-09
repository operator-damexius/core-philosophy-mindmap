/**
 * Core UI functionality
 * Handles theme switching, search, and datetime display
 */

// Constants
const DEBOUNCE_DELAY = 300;
const QUOTE_ROTATION_INTERVAL = 10000;
const QUOTE_FADE_DURATION = 1000;
const DATE_UPDATE_INTERVAL = 1000;

// DOM Elements
const elements = {
    contentSection: document.getElementById('philosophy-content'),
    themeToggle: document.getElementById('theme-toggle'),
    searchBar: document.getElementById('search-bar'),
    dateDisplay: document.getElementById('date-display'),
    timeDisplay: document.getElementById('time-display'),
    quoteElement: document.getElementById('quote')
};

// Utility Functions
const updateDateTime = () => {
    const now = new Date();
    elements.dateDisplay.textContent = now.toLocaleDateString().toUpperCase();
    elements.timeDisplay.textContent = now.toLocaleTimeString().toUpperCase();
};

const rotateQuote = () => {
    const quotes = window.philosophyQuotes || [];
    if (!quotes.length) {
        elements.quoteElement.textContent = 'No quotes available';
        return;
    }

    elements.quoteElement.classList.add('fade');
    setTimeout(() => {
        elements.quoteElement.textContent = quotes[currentQuoteIndex];
        elements.quoteElement.classList.remove('fade');
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    }, QUOTE_FADE_DURATION);
};

// State Variables
let currentQuoteIndex = 0;
let debounceTimeout;

// Event Handlers
const handleThemeToggle = () => {
    const isDark = elements.themeToggle.checked;
    document.body.classList.toggle('dark', isDark);
    logger.logThemeChange(isDark ? 'dark' : 'light');
    
    // Save theme preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

const handleSearch = () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        const query = elements.searchBar.value.toLowerCase().trim();
        logger.logSearch(query);
        
        const items = document.querySelectorAll('.philosophy-item');
        if (!query) {
            items.forEach(item => item.style.display = '');
            return;
        }

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const isVisible = text.includes(query);
            item.style.display = isVisible ? '' : 'none';
            
            // Add subtle highlight to matching terms
            if (isVisible) {
                const term = item.querySelector('.philosophy-term');
                if (term && term.textContent.toLowerCase().includes(query)) {
                    term.style.opacity = '1';
                }
            }
        });
    }, DEBOUNCE_DELAY);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Validate required elements
    const missingElements = Object.entries(elements)
        .filter(([_, element]) => !element)
        .map(([name]) => name);

    if (missingElements.length > 0) {
        console.error(`Missing required elements: ${missingElements.join(', ')}`);
        return;
    }

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        elements.themeToggle.checked = savedTheme === 'dark';
        document.body.classList.toggle('dark', savedTheme === 'dark');
    }

    // Set up event listeners
    elements.themeToggle.addEventListener('change', handleThemeToggle);
    elements.searchBar.addEventListener('input', handleSearch);

    // Add click handler for philosophy items
    elements.contentSection.addEventListener('click', (event) => {
        const item = event.target.closest('.philosophy-item');
        if (item) {
            const term = item.querySelector('.philosophy-term');
            if (term) {
                logger.logPhilosophyInteraction(term.textContent, 'click');
            }
        }
    });

    // Initialize displays
    updateDateTime();
    rotateQuote();

    // Set up intervals
    const dateTimeInterval = setInterval(updateDateTime, DATE_UPDATE_INTERVAL);
    const quoteInterval = setInterval(rotateQuote, QUOTE_ROTATION_INTERVAL);

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        clearInterval(dateTimeInterval);
        clearInterval(quoteInterval);
        clearTimeout(debounceTimeout);
    });
});