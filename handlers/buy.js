import WFMApi from "../WFMApi/WFMApi.js";
import filterOrders from "../utils/filterOrders.js";
export default class buyHandler {
    static #skipList = [];
    #isVisible = order => order.visible;

    static async process(userBuyOrders) {
        for (const uBuyOrder of userBuyOrders) {
            const itemSlug = await WFMApi.getItemSlugById(uBuyOrder.itemId);
            const { sell: sellOrders, buy: buyOrders } = filterOrders(await WFMApi.getItemOrders(itemSlug), { filterStatus: 'ingame' });
            console.log(sellOrders[0]);
        }
        
    }
}