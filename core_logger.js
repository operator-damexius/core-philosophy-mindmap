const logger = {
    version: "v1.1",
    logLevels: {
        INFO: 'INFO',
        WARNING: 'WARNING',
        ERROR: 'ERROR',
        DEBUG: 'DEBUG'
    },
    
    log: function(message, level = this.logLevels.INFO) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level}] ${message}`);
        this.saveToHistory(timestamp, level, message);
    },
    
    error: function(message, error = null) {
        const timestamp = new Date().toISOString();
        const errorMessage = error ? `${message} - ${error.message}` : message;
        console.error(`[${timestamp}] [${this.logLevels.ERROR}] ${errorMessage}`);
        if (error) {
            console.error(error.stack);
        }
        this.saveToHistory(timestamp, this.logLevels.ERROR, errorMessage);
    },
    
    warning: function(message) {
        this.log(message, this.logLevels.WARNING);
    },
    
    debug: function(message) {
        this.log(message, this.logLevels.DEBUG);
    },
    
    logSearch: function(query) {
        this.log(`SEARCH QUERY: ${query}`, this.logLevels.INFO);
    },
    
    logThemeChange: function(theme) {
        this.log(`THEME CHANGED TO: ${theme}`, this.logLevels.INFO);
    },
    
    logPhilosophyView: function(term) {
        this.log(`PHILOSOPHY TERM VIEWED: ${term}`, this.logLevels.INFO);
    },
    
    logPhilosophyInteraction: function(term, action) {
        this.log(`PHILOSOPHY INTERACTION: ${action} - ${term}`, this.logLevels.INFO);
    },
    
    logQuoteChange: function(quote) {
        this.log(`QUOTE CHANGED: ${quote.substring(0, 50)}...`, this.logLevels.INFO);
    },
    
    logError: function(error, context = '') {
        this.error(`${context} ${error.message}`, error);
    },
    
    saveToHistory: function(timestamp, level, message) {
        if (!this.history) {
            this.history = [];
        }
        this.history.push({ timestamp, level, message });
        
        // Keep only last 1000 logs
        if (this.history.length > 1000) {
            this.history.shift();
        }
    },
    
    getHistory: function(level = null) {
        if (!this.history) return [];
        if (!level) return this.history;
        return this.history.filter(log => log.level === level);
    },
    
    clearHistory: function() {
        this.history = [];
        this.log('LOG HISTORY CLEARED', this.logLevels.INFO);
    },
    
    getStats: function() {
        if (!this.history) return { total: 0, errors: 0, warnings: 0 };
        
        return {
            total: this.history.length,
            errors: this.history.filter(log => log.level === this.logLevels.ERROR).length,
            warnings: this.history.filter(log => log.level === this.logLevels.WARNING).length
        };
    }
};

// Initialize logger history
logger.history = [];

// Add error handling for console methods
const originalConsoleError = console.error;
console.error = function() {
    logger.error(Array.from(arguments).join(' '));
    originalConsoleError.apply(console, arguments);
};

window.logger = logger;