import WFMApi from "../WFMApi/WFMApi.js";
import { sortByPlatinum, isNewerStamp, delay} from "../utils/utils.js";
import logs from "../config/logsMessages.js";
import SellBuyBase from "./SellBuyBase.js";

export default class SellHandler extends SellBuyBase {
    static async process(userSellOrders, userSlug) {
        for (const userOrder of userSellOrders) {
            const { itemName, itemSellOrders, itemBuyOrders } = await this._parseAndFilter(userOrder);
            //console.log(itemName);
            // console.log(itоemBuyOrders.map(o => o.user?.ingameName));

            if (itemBuyOrders && itemBuyOrders.length !== 0) {
                for (const buyOrder of itemBuyOrders) {
                    if (this._skipList.has(buyOrder.user?.id) || buyOrder.user?.slug === userSlug) continue;

                    if (buyOrder.platinum >= userOrder.platinum) {
                        console.log(logs[this.language].SHBuyerFound(itemName, buyOrder.user?.ingameName));
                        this._messageBoxShow(logs[this.language].SHBuyerFoundMsgBox(itemName, buyOrder.user?.ingameName));
                        this._skipList.add(buyOrder.user?.id);
                    }
                }
            }

            // if (itemBuyOrders && itemBuyOrders.length !== 0) {
            //     sortByPlatinum(itemBuyOrders, true);
            //     if (itemBuyOrders[0].user && itemBuyOrders[0].user?.slug === userSlug) continue;
                
            //     for (const buyOrder of itemBuyOrders) {
            //         if(buyOrder.user?.slug === userSlug) continue;
            //         if(buyOrder.platinum === userOrder.platinum && isNewerStamp(buyOrder.updatedAt, userOrder.updatedAt)) {
            //             WFMApi.modifyOrder(userOrder.id, userOrder.platinum, userOrder.quantity);
            //             console.log(`Предмет ${itemName} был выше у ${buyOrder.user?.ingameName}`);
            //         }
            //     }
            // }
            await delay(this._handlerInterval);
        }
    }
}