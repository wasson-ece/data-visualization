function generateSeededRandom(baseSeed = 2): Function {
    let seed = baseSeed;
    return function seededRandom(max: number, min: number) {
        max = max || 1;
        min = min || 0;

        seed = (seed * 9301 + 49297) % 233280;
        const rnd = seed / 233280;

        return min + rnd * (max - min);
    };
}

const seededRandom = generateSeededRandom(9);

/**
 * Get the array of x and y pairs.
 * The function tries to avoid too large changes of the chart.
 * @param {number} total Total number of values.
 * @returns {Array} Array of data.
 * @private
 */
function getRandomSeriesData(total: number) {
    const result = [];
    let lastY = seededRandom() * 40 - 20;
    let y;
    const firstY = lastY;
    for (let i = 0; i < total; i++) {
        y = seededRandom() * firstY - firstY / 2 + lastY;
        result.push({
            x: i,
            y
        });
        lastY = y;
    }
    return result;
}
