import WFMApi from "../WFMApi/WFMApi.js";
import { sortByPlatinum, isNewerStamp, delay} from "../utils/utils.js";
import logs from "../config/logsMessages.js";
import SellBuyBase from "./SellBuyBase.js";

export default class BuyHandler extends SellBuyBase {
    static async process(userBuyOrders, userSlug) {
        for (const userOrder of userBuyOrders) {
            const { itemName, itemSellOrders, itemBuyOrders } = await this._parseAndFilter(userOrder);
            // console.log(itemName);
            // console.log(itemBuyOrders.map(o => o.user?.ingameName));
            if (itemSellOrders && itemSellOrders.length !== 0) {
                for (const sellOrder of itemSellOrders) {
                    if (this._skipList.has(sellOrder.user?.id) || sellOrder.user?.slug === userSlug) continue;

                    if (sellOrder.platinum <= userOrder.platinum) {
                        console.log(logs[this.language].BHSellerFound(itemName, sellOrder.user?.ingameName));
                        this._messageBoxShow(logs[this.language].BHSellerFoundMsgBox(itemName, sellOrder.user?.ingameName));
                        this._skipList.add(sellOrder.user?.id);
                    }
                }
            }

            if (itemBuyOrders && itemBuyOrders.length !== 0) {
                sortByPlatinum(itemBuyOrders, true);
                if (itemBuyOrders[0].user && itemBuyOrders[0].user?.slug === userSlug) continue;
                
                for (const buyOrder of itemBuyOrders) {
                    if(buyOrder.user?.slug === userSlug) continue;
                    if(buyOrder.platinum === userOrder.platinum && isNewerStamp(buyOrder.updatedAt, userOrder.updatedAt)) {
                        WFMApi.modifyOrder(userOrder.id, userOrder.platinum, userOrder.quantity);
                        console.log(`Предмет ${itemName} был выше у ${buyOrder.user?.ingameName}`);
                    }
                }
            }
            await delay(this._handlerInterval);
        }
    }
}