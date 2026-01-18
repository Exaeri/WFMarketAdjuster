import clsColor from "../utils/clsColor.js";

/**
 * Returns the current time formatted as HH:MM (24-hour format).
 *
 * @param {Date} [date=new Date()] - Date object to format.
 * @returns {string} Formatted time string in HH:MM format.
 *
 */
function getTime(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

const buyHandler = `${clsColor.FgGreen}[BuyHandler]${clsColor.Reset}`;
const sellHandler = `${clsColor.FgMagenta}[SellHandler]${clsColor.Reset}`;
const time = () => `${clsColor.FgCyan}[${getTime()}]${clsColor.Reset}`;
const itemColor = (item) => `${clsColor.FgCyan}${item}${clsColor.Reset}`;
const userColor = (user) => `${clsColor.FgRed}${user}${clsColor.Reset}`;

const logs = {
    en: {
        BHSellerFound: (item, seller) =>
        `${time()}${buyHandler} ${itemColor(item)} with preferred price on sale from ${userColor(seller)}.`,
        BHSellerFoundMsgBox: (item, seller) =>
        `The ${item} with preferred price on sale from ${seller}`,
        SHBuyerFound: (item, buyer) =>
        `${time()}${sellHandler} A potential buyer for the ${itemColor(item)} with name ${userColor(buyer)}.`,
        SHBuyerFoundMsgBox: (item, buyer) =>
        `A potential buyer for the ${item} has been found with name ${buyer}.`,
        BHNewerStamp: (item, buyer) =>
        `${time()}${buyHandler} ${userColor(buyer)} had a newer timestamp for the ${itemColor(item)}.`,
        SHPriceIncreased: (item, price) =>
        `${time()}${sellHandler} The price of ${itemColor(item)} has been increased to ${userColor(price)}.`,
        SHNewerStamp: (item, seller) =>
        `${time()}${sellHandler} ${userColor(seller)} had a newer timestamp for the ${itemColor(item)}.`,
        SHPriceChanged: (item, seller, diff) =>
        `${time()}${sellHandler} The price of ${itemColor(item)} has been reduced by ${userColor(diff)} by ${userColor(seller)}.`
    },
    ru: {
        BHSellerFound: (item, seller) =>
        `${time()}${buyHandler} ${itemColor(item)} по искомой цене в продаже у ${userColor(seller)}.`,
        BHSellerFoundMsgBox: (item, seller) =>
        `Предмет ${item} по искомой цене в продаже у ${seller}`,
        SHBuyerFound: (item, buyer) =>
        `${time()}${sellHandler} Для ${itemColor(item)} найден потенциальный покупатель с ником ${userColor(buyer)}.`,
        SHBuyerFoundMsgBox: (item, buyer) =>
        `Для ${item} найден потенциальный покупатель с ником ${buyer}.`,
        BHNewerStamp: (item, buyer) =>
        `${time()}${buyHandler} ${itemColor(item)} был выше в списке у ${userColor(buyer)}.`,
        SHPriceIncreased: (item, price) =>
        `${time()}${sellHandler} Цена на ${itemColor(item)} была увеличена до ${userColor(price)}.`,
        SHNewerStamp: (item, seller) =>
        `${time()}${sellHandler} ${itemColor(item)} был выше в списке у ${userColor(seller)}.`,
        SHPriceChanged: (item, seller, diff) =>
        `${time()}${sellHandler} ${itemColor(item)} был дешевле на ${userColor(diff)} у ${userColor(seller)}.`
    }
};

export default logs;