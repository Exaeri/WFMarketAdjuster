import WFMApi from "../WFMApi/WFMApi.js";
import delay from "../utils/delay.js";
import logs from "../config/logsMessages.js";
import SellBuyBase from "./SellBuyBase.js";
import messageBox from "../utils/msgBox.js";

export default class BuyHandler extends SellBuyBase {
    static async process(userBuyOrders, userSlug) {
        for (const userOrder of userBuyOrders) {
            const { itemName, itemSellOrders, itemBuyOrders } = await this._parseAndFilter(userOrder);

            if (itemSellOrders && itemSellOrders.length !== 0) {
                for (const sellOrder of itemSellOrders) {
                    if (this._skipList.has(sellOrder.user?.id) || sellOrder.user?.slug === userSlug) continue;

                    if (sellOrder.platinum <= userOrder.platinum) {
                        console.log(logs[this.language].BHSellerFound(itemName, sellOrder.user?.ingameName));
                        messageBox(logs[this.language].BHSellerFoundMsgBox(itemName, sellOrder.user?.ingameName));
                        this._skipList.add(sellOrder.user?.id);
                    }
                }
            }

            if (itemBuyOrders && itemBuyOrders.length !== 0) {
                this._sortByPlatinum(itemBuyOrders, true);
                if (itemBuyOrders[0].user && itemBuyOrders[0].user?.slug === userSlug) continue;
                
                for (const buyOrder of itemBuyOrders) {
                    if(buyOrder.user?.slug === userSlug) continue;

                    if(buyOrder.platinum === userOrder.platinum && this._isNewerStamp(buyOrder.updatedAt, userOrder.updatedAt)) {
                        await this._tryModify(userOrder.id, userOrder.platinum, userOrder.quantity, itemName);
                        console.log(logs[this.language].BHNewerStamp(itemName, buyOrder.user?.ingameName));
                        break;
                    }
                }
            }
            await delay(this._handlerInterval);
        }
    }
}