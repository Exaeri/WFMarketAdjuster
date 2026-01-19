import WFMApi from "../WFMApi/WFMApi.js";
import filterOrders from "../utils/filterOrders.js";
import config from "../config/adjuster.config.js";
export default class SellBuyBase {
    static _skipList = new Set();
    static _handlerInterval = config?.delays?.handlersStep || 1000;
    static _logsLang = 'en';

    static set language(lang) {
        this._logsLang = lang;
    }

    static get language() {
        return this._logsLang;
    }

    static _isNewerStamp(dateStr1, dateStr2) {
        const date1 = new Date(dateStr1);
        const date2 = new Date(dateStr2);

        return date1.getTime() > date2.getTime();
    }

    static _sortByPlatinum(items, descending = false) {
        return items.sort((a, b) => {
            const priceDiff = (descending ? b.platinum - a.platinum : a.platinum - b.platinum);
            if (priceDiff !== 0) return priceDiff;

            const ta = Date.parse(a.updatedAt) || 0;
            const tb = Date.parse(b.updatedAt) || 0;

            return tb - ta;
        });
    }

    static async _tryModify(id, price, quantity, itemName) {
        console.log(`Trying to modify ${itemName}`);
        try {
            await WFMApi.modifyOrder(id, price, quantity);
        } catch (err) {
            console.log(`Failed to modify ${itemName}, skipping`);
            console.debug(err);
        }
    }

    static async _parseAndFilter(order) {
        const itemSlug = await WFMApi.getItemSlugById(order.itemId);
        const itemName = await WFMApi.getItemNameBySlug(itemSlug);

        let allItemOrders;
        try {
            allItemOrders = await WFMApi.getItemOrders(itemSlug);
        }
        catch (err) {
            console.error(`Error while fetching orders for item: ${itemName}`, err);
            return; 
        }
        if(!allItemOrders || allItemOrders.length === 0) {
            console.warn(`No orders found for item: ${itemName}`);
            return;
        }
        const { sell: itemSellOrders, buy: itemBuyOrders } = filterOrders(allItemOrders, { filterStatus: 'ingame', filterRank: order.rank });
        return { itemName, itemSellOrders, itemBuyOrders };
    }

    static async process() {
        throw new Error('process() must be used in subclass');
    }
}