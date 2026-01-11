/**
 * Filters user orders into visible sell and buy orders
 *
 * @param {Array<Object>} allOrders - List of user orders.
 *
 * @returns {{ sell: Array<Object>, buy: Array<Object> }}
 * An object containing two arrays:
 * - `sell`: visible sell orders
 * - `buy`: visible buy orders
 *
 * @throws {TypeError} If `allOrders` is not an array.
 */
export default function filterOrders(allOrders, { filterStatus = null } = {}) {
    if (!Array.isArray(allOrders)) {
        throw new TypeError('filterOrders: expected an array of orders');
    }
    if (filterStatus !== null && typeof filterStatus !== 'string') {
        throw new TypeError('filterOrders: filterStatus must be a string or null');
    }

    const sell = [];
    const buy = [];

    for (const order of allOrders) {
        if(!order.visible) continue;
        if(filterStatus && order.user?.status !== filterStatus) continue;

        if (order.type === 'sell') sell.push(order);
        else if (order.type === 'buy') buy.push(order);
    }

    return { sell, buy };
}