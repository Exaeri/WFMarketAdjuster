import { promises as fs } from 'fs';

export const clsColor = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
}

/**
 * Returns a promise that resolves after the specified delay.
 *
 * @param {number} time - Delay duration in milliseconds.
 * @returns {Promise<void>} Promise that resolves after the given time.
 *
 * @example
 * await delay(1000); // waits for 1 second
 */
export function delay(time) {
    if (typeof time !== 'number' || time < 0)
        throw new TypeError('Time must be a non-negative number');
    return new Promise(resolve => setTimeout(resolve, time));
} 

/**
 * Returns the current time formatted as HH:MM (24-hour format).
 *
 * @param {Date} [date=new Date()] - Date object to format.
 * @returns {string} Formatted time string in HH:MM format.
 *
 */
export function getTime(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Reads and parses a JSON file.
 *
 * @param {string} filePath - Path to the JSON file.
 * @returns {Promise<Object>} Parsed JSON object.
 *
 * @throws {Error} If file cannot be read or JSON is invalid.
 */
export async function readJSON(filePath) {
    if (typeof filePath !== 'string')
        throw new Error('filePath must be a string');

    const data = await fs.readFile(filePath, 'utf-8');

    try {
        return JSON.parse(data);
    } catch (err) {
        throw new Error(`Invalid JSON in file ${filePath}`);
    }
}