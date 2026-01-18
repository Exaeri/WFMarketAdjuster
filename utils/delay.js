/**
 * Returns a promise that resolves after the specified delay.
 *
 * @param {number} time - Delay duration in milliseconds.
 * @returns {Promise<void>} Promise that resolves after the given time.
 *
 * @example
 * await delay(1000); // waits for 1 second
 */
export default function delay(time) {
    if (typeof time !== 'number' || time < 0)
        throw new TypeError('Time must be a non-negative number');
    return new Promise(resolve => setTimeout(resolve, time));
} 
