/**
 * Universal filter for orders. 
 *
 * Check if order is visible and divide orders by type.:
 *
 * Optional filters:
 * - `filterStatus`: filtering status like 'ingame'
 * - `filterRank`: filtering rank if the order has a rank
 *
 * @param {Array<Object>} allOrders
 *   List of orders to filter.
 *
 * @param {Object} [options]
 *   Optional filter options.
 *
 * @param {string|null} [options.filterStatus=null]
 *   If used, will filter orders by `status`.
 *
 * @param {number} [options.filterRank]
 *   If used, will filter orders by `rank`.
 *
 * @returns {{ sell: Array<Object>, buy: Array<Object> }}
 *   An object containing two arrays:
 *   - `sell`: visible sell orders matching the filters
 *   - `buy`: visible buy orders matching the filters
 *
 * @throws {TypeError}
 *   If `allOrders` is not an array.
 *
 * @throws {TypeError}
 *   If `filterStatus` is not a string or null.
 *
 * @throws {TypeError}
 *   If `filterRank` is not a number or undefined.
 */
export default function filterOrders(allOrders, { filterStatus = null, filterRank = undefined } = {}) {
    if (!Array.isArray(allOrders)) {
        throw new TypeError('filterOrders: expected an array of orders');
    }
    if (filterStatus !== null && typeof filterStatus !== 'string') {
        throw new TypeError('filterOrders: filterStatus must be a string or null');
    }
    if (filterRank !== undefined && typeof filterRank !== 'number') {
        throw new TypeError('filterOrders: filterRank must be a number or undefined');
    }

    const sell = [];
    const buy = [];

    for (const order of allOrders) {
        if(!order.visible) continue;
        if(filterStatus && order.user?.status !== filterStatus) continue;
        if (filterRank !== undefined && order.rank !== undefined && order.rank !== filterRank) {
            continue;
        }

        if (order.type === 'sell') sell.push(order);
        else if (order.type === 'buy') buy.push(order);
    }

    return { sell, buy };
}