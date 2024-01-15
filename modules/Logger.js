const LOG_LEVEL = 4; // 2 ERROR, 3 WARN, 4 INFO, 5 DEBUG

export function error(...args) { if (LOG_LEVEL >= 2) console.error(...args); }

export function warn(...args) { if (LOG_LEVEL >= 3) console.warn(...args); }

export function log(...args) { if (LOG_LEVEL >= 4) console.log(...args); }
// For DEBUG log level: verbose must be turned on in Dev Tools
export function debug(...args) { if (LOG_LEVEL >= 5) console.debug(...args); }