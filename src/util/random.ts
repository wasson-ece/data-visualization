/**
 * Get the array of x and y pairs.
 * The function tries to avoid too large changes of the chart.
 * @param {number} total Total number of values.
 * @returns {Array} Array of data.
 * @private
 */
export function getRandomSeriesData(total: number) {
    const result = [];
    for (let i = 0; i < total; i++) {
        result.push({ x: i, y: 30 * Math.random() });
    }
    return result;
}
