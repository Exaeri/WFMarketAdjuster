import WFMApi from "./WFMApi/WFMApi.js";
import authWFM from "./auth/authWFM.js";
import { readJSON, clsColor } from "./utils/utils.js";
import filterOrders  from "./utils/filterOrders.js";

const config = await readJSON('./config/config.json');

console.log(`${clsColor.FgCyan}Authenticating...${clsColor.Reset}`);
const userSlug = await authWFM();;

let userProfile;
try {
    userProfile = await WFMApi.getUserPublicInfo(userSlug);
} catch (err) {
    console.error(err.message);
}

/*-----------WFMApi setups------------*/
console.log(`Platform: ${userProfile.platform}\nCrossplay: ${userProfile.crossplay}\nLanguage: ${userProfile.locale}\n`);
WFMApi.platform = userProfile.platform;
WFMApi.crossplay = userProfile.crossplay;
WFMApi.language = userProfile.locale; 
WFMApi.cooldown = config.delays.WFMApi;
/*-----------WFMApi setups------------*/

/*----------Loading handlers-----------*/
let buyHandler = null;
let sellHandler = null;;
console.log(`${clsColor.FgCyan}Handlers${clsColor.Reset}:`);
if(config.handlers.buy) {
    buyHandler = (await import('./handlers/buy.js')).default;
    console.log(`${clsColor.FgGreen}[+]${clsColor.Reset} Buy`);
}
else
{
    console.log(`${clsColor.FgRed}[-]${clsColor.Reset} Buy`);
}
if(config.handlers.sell) {
    sellHandler = (await import('./handlers/sell.js')).default;
    console.log(`${clsColor.FgGreen}[+]${clsColor.Reset} Sell`);
}
else
{
    console.log(`${clsColor.FgRed}[-]${clsColor.Reset} Sell`);
}
if(!buyHandler && !sellHandler) {
    console.log(`${clsColor.FgRed}No handlers enabled. Exiting...${clsColor.Reset}`);
    process.exit(1);
}
/*----------Loading handlers-----------*/

/*-----------Main process-------------*/
console.log(`\n${clsColor.FgCyan}Processing...${clsColor.Reset}`);

if(!userProfile || !userProfile.status) {
    console.error(`Invalid user data: ${userProfile}`);
}

// if(userProfile.status !== 'ingame') {
//     console.error(`User is not ingame: ${userProfile.status}`);
// }
let allUserOrders;
try {
    allUserOrders = await WFMApi.getMyOrders();
} catch (err) {
    console.error(err.message);
}

const { sell: userSellOrders, buy: userBuyOrders } = filterOrders(allUserOrders);

if(buyHandler && userBuyOrders.length > 0) 
    await buyHandler.process(userBuyOrders);
// if(sellHandler && userSellOrders.length > 0) 
//     await sellHandler.process(userSellOrders);

/*-----------Main process-------------*/
