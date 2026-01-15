import { clsColor, getTime } from "../utils/utils.js";

const time = `${clsColor.FgCyan}[${getTime()}]${clsColor.Reset}`;
const buyHandler = `${clsColor.FgGreen}[BuyHandler]${clsColor.Reset}`;
const sellHandler = `${clsColor.FgMagenta}[SellHandler]${clsColor.Reset}`;

const logs = {
    en: {
        BHSellerFound: (item, seller) =>
        `${time}${buyHandler} ${clsColor.FgCyan}${item}${clsColor.Reset} with preferred price on sale from ${clsColor.FgRed}${seller}${clsColor.Reset}.`,
        BHSellerFoundMsgBox: (item, seller) =>
        `The ${item} with preferred price on sale from ${seller}`
    },
    ru: {
        BHSellerFound: (item, seller) =>
        `${time}${buyHandler} ${clsColor.FgCyan}${item}${clsColor.Reset} по искомой цене в продаже у ${clsColor.FgRed}${seller}${clsColor.Reset}.`,
        BHSellerFoundMsgBox: (item, seller) =>
        `Предмет ${item} по искомой цене в продаже у ${seller}`,
        SHBuyerFound: (item, buyer) =>
        `${time}${sellHandler} Для ${clsColor.FgCyan}${item}${clsColor.Reset} найден потенциальный покупатель с ником ${clsColor.FgRed}${buyer}${clsColor.Reset}.`,
        SHBuyerFoundMsgBox: (item, buyer) =>
        `Для ${item} найден потенциальный покупатель с ником ${buyer}.`
    }
};

export default logs;