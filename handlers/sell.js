import WFMApi from "../WFMApi/WFMApi.js";
import delay from "../utils/delay.js";
import logs from "../config/logsMessages.js";
import SellBuyBase from "./SellBuyBase.js";
import config from "../config/adjuster.config.js";
import messageBox from "../utils/msgBox.js";

export default class SellHandler extends SellBuyBase {
    static #allowPriceChange = config.sellHandler?.allowPriceChange ?? true;
    static #priceReductionLimit = config.sellHandler?.reductionLimit || 2;
    static #reductionLimitGrow = config.sellHandler?.limitGrowing ?? true;
    static #initPrices = new Map();

    static #getReductionLimit(orderID) {
        const baseLimit = this.#priceReductionLimit;

        if (!this.#reductionLimitGrow) {
            return baseLimit;
        }

        const initialPrice = this.#initPrices.get(orderID);

        let growing = 0;

        if (initialPrice > 100) {
            growing = 2;
        } else if (initialPrice > 20) {
            growing = 1;
        }

        return baseLimit + growing;
    }

    static #shouldReducePrice(orderID, orderPrice, userPrice) {
        if(!this.#allowPriceChange) return false;
        if (!(orderPrice < userPrice)) return false;

        const initialPrice = this.#initPrices.get(orderID);
        const allowedReduction = this.#getReductionLimit(orderID);
        const minAllowedPrice = initialPrice - allowedReduction;

        return orderPrice >= minAllowedPrice;
    }

    static async process(userSellOrders, userSlug) {
        const activeOrderIds = new Set(userSellOrders.map(order => order.id));

        for (const orderId of this.#initPrices.keys()) {
            if (!activeOrderIds.has(orderId)) {
                this.#initPrices.delete(orderId);
            }
        }

        for (const userOrder of userSellOrders) {
            const { itemName, itemSellOrders, itemBuyOrders } = await this._parseAndFilter(userOrder);

            if(!this.#initPrices.has(userOrder.id)) 
                this.#initPrices.set(userOrder.id, userOrder.platinum);

            if (itemBuyOrders && itemBuyOrders.length !== 0) {
                for (const buyOrder of itemBuyOrders) {
                    if (this._skipList.has(buyOrder.user?.id) || buyOrder.user?.slug === userSlug) continue;

                    if (buyOrder.platinum >= userOrder.platinum) {
                        console.log(logs[this.language].SHBuyerFound(itemName, buyOrder.user?.ingameName));
                        messageBox(logs[this.language].SHBuyerFoundMsgBox(itemName, buyOrder.user?.ingameName));
                        this._skipList.add(buyOrder.user?.id);
                    }
                }
            }

            if (itemSellOrders && itemSellOrders.length !== 0) {
                this._sortByPlatinum(itemSellOrders);
                if (itemSellOrders[0].user && itemSellOrders[0].user?.slug === userSlug) {
                    if (this.#allowPriceChange && itemSellOrders[1].platinum > userOrder.platinum) {
                        await this._tryModify(userOrder.id, itemSellOrders[1].platinum, userOrder.quantity, itemName);
                        console.log(logs[this.language].SHPriceIncreased(itemName, itemSellOrders[1].platinum));
                        continue;
                    }
                    continue;
                }

                for (const sellOrder of itemSellOrders) {
                    if(sellOrder.user?.slug === userSlug) continue;

                    if(this.#shouldReducePrice(userOrder.id, sellOrder.platinum, userOrder.platinum)) {
                        await this._tryModify(userOrder.id, sellOrder.platinum, userOrder.quantity, itemName);
                        console.log(logs[this.language].SHPriceChanged(itemName, sellOrder.user?.ingameName, userOrder.platinum - sellOrder.platinum));
                        break;
                    }

                    if(sellOrder.platinum === userOrder.platinum && this._isNewerStamp(sellOrder.updatedAt, userOrder.updatedAt)) {
                        await this._tryModify(userOrder.id, userOrder.platinum, userOrder.quantity, itemName);
                        console.log(logs[this.language].SHNewerStamp(itemName, sellOrder.user?.ingameName));
                        break;
                    }
                }
            }
            await delay(this._handlerInterval);
        }
    }
}