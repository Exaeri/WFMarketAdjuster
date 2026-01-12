import WFMApi from "../WFMApi/WFMApi.js";
import filterOrders from "../utils/filterOrders.js";
import { sortByPlatinum, isNewerStamp, delay, clsColor } from "../utils/utils.js";
import config from "../config/adjuster.config.js";
export default class buyHandler {
    static #skipList = new Set();
    static #handlerInterval = config?.delays?.handlersStep || 1000;

    static async process(userBuyOrders, userSlug) {
        for (const userOrder of userBuyOrders) {
            const itemSlug = await WFMApi.getItemSlugById(userOrder.itemId);
            const itemName = await WFMApi.getItemNameBySlug(itemSlug);

            let allItemOrders;
            try {
                allItemOrders = await WFMApi.getItemOrders(itemSlug);
            }
            catch (err) {
                console.error(`Error while fetching orders for item: ${itemName}`, err);
                continue; 
            }
            if(!allItemOrders || allItemOrders.length === 0) {
                console.warn(`No orders found for item: ${itemName}`);
                continue;
            }

            const { sell: itemSellOrders, buy: itemBuyOrders } = filterOrders(allItemOrders, { filterStatus: 'ingame', filterRank: userOrder.rank });

            if (itemSellOrders && itemSellOrders.length !== 0) {
                for (const sellOrder of itemSellOrders) {
                    if (this.#skipList.has(sellOrder.user?.id)) continue;

                    if (sellOrder.platinum <= userOrder.platinum) {
                        console.log(`Предмет ${itemName} по искомой цене в продаже у ${sellOrder.user?.ingameName}`)
                        this.#skipList.add(sellOrder.user?.id);
                    }
                }
            }

            if (itemBuyOrders && itemBuyOrders.length !== 0) {
                sortByPlatinum(itemBuyOrders, true);
                if (itemBuyOrders[0].user && itemBuyOrders[0].user?.slug === userSlug) continue;
                
                for (const buyOrder of itemBuyOrders) {
                    if(buyOrder.platinum === userOrder.platinum && isNewerStamp(buyOrder.updatedAt, userOrder.updatedAt)) {
                        WFMApi.modifyOrder(userOrder.id, userOrder.platinum, userOrder.quantity);
                        console.log(`Предмет ${itemName} был выше у ${buyOrder.user?.ingameName}`);
                    }
                }
            }
            await delay(this.#handlerInterval);
        }
    }
}