import WFMApi from "../WFMApi/WFMApi.js";
import filterOrders from "../utils/filterOrders.js";
import config from "../config/adjuster.config.js";
import { clsColor } from "../utils/utils.js";
import BuyHandler from "./buy.js";
import SellHandler from "./sell.js";
import userJWT from "../config/userJWT.js";
import logs from "../config/logsMessages.js";
export default class mainHandler {
    static #user = null;
    static #buyHandler = true;
    static #sellHandler = true;

    /**
     * Authenticates the user in warframe.market API using a JWT key.
     *
     * Reads JWT key from a local file.
     *
     * @async
     * @function authWFM
     *
     * @returns {Promise<string>} The authenticated user's slug.
     *
     * @throws {Error}
     * Thrown if:
     * - JWT key is missing or not a non-empty string
     * - JWT key was not replaced from the default placeholder (`YOUR_JWT`)
     *
     * @throws {Error}
     * If the authentication request to the API fails.
     *
     * @example
     * const userSlug = await authWFM();
     * console.log(`Logged in as ${userSlug}`);
     */
    static async authWFM() {
        if(typeof userJWT !== 'string' || userJWT.length === 0) 
            throw new Error(`${clsColor.FgYellow}JWT${clsColor.Reset} must be a non-empty string (${clsColor.FgYellow}/config/userJWT.js${clsColor.Reset})`);
        if(userJWT === 'YOUR_JWT') 
            throw new Error(`Replace ${clsColor.FgYellow}YOUR_JWT${clsColor.Reset} with your JWT in ${clsColor.FgYellow}./config/userJWT.js${clsColor.Reset}`);

        console.log(`${clsColor.FgBlue}Authenticating...${clsColor.Reset}`);
        WFMApi.JWT = userJWT;

        let userProfile;
        try {
            userProfile = await WFMApi.getMyProfile();
        } catch (err) {
            console.error(`${err.message} ${clsColor.FgRed}Exiting...${clsColor.Reset}`);
            process.exit(1)
        }

        console.log(`${clsColor.FgGreen}[+]${clsColor.Reset} Success: authenticated as ${clsColor.FgCyan}${userProfile.slug}${clsColor.Reset}`);
        this.#user = userProfile;
    }
    static async configInit() {
        if(!this.#user) {
            console.error(`${clsColor.FgRed}User not authenticated. Exiting...${clsColor.Reset}`);
            process.exit(1);
        }
        console.log(`Platform: ${this.#user.platform}\nCrossplay: ${this.#user.crossplay}\nLanguage: ${this.#user.locale}\n`);
        WFMApi.platform = this.#user.platform;
        WFMApi.crossplay = this.#user.crossplay;
        WFMApi.language = this.#user.locale;
        WFMApi.cooldown = config?.delays?.WFMApi || 750;
        
        BuyHandler.language = logs[WFMApi.language] ? WFMApi.language : 'en';
        SellHandler.language = logs[WFMApi.language] ? WFMApi.language : 'en';
        
        console.log(`${clsColor.FgBlue}Handlers:${clsColor.Reset}`);

        if(config?.handlers?.buy ?? true) 
            console.log(`${clsColor.FgGreen}[+]${clsColor.Reset} Buy`);
        else
        {
            console.log(`${clsColor.FgRed}[-]${clsColor.Reset} Buy`);
            this.#buyHandler = false;
        }

        if(config?.handlers?.sell ?? true) 
            console.log(`${clsColor.FgGreen}[+]${clsColor.Reset} Sell`);
        else
        {
            console.log(`${clsColor.FgRed}[-]${clsColor.Reset} Sell`);
            this.#sellHandler = false;
        }

        if(!this.#buyHandler && !this.#sellHandler) {
            console.log(`${clsColor.FgRed}No handlers enabled. Exiting...${clsColor.Reset}`);
            process.exit(1);
        }
    }
    static async process() {
        console.log(`\n${clsColor.FgBlue}Process started:${clsColor.Reset}`);
        console.log(`----------------`);

        let userInfo, allUserOrders;
        try {
            userInfo = await WFMApi.getUserPublicInfo(this.#user.slug);
            allUserOrders = await WFMApi.getMyOrders();
        } catch (err) {
            console.error(err.message);
        }

        if(!userInfo || !userInfo.status) {
            console.error(`Invalid user data: ${userInfo}`);
        }

        // if(userInfo.status !== 'ingame') {
        //     console.error(`User is not ingame: ${userInfo.status}`);
        // }
        //let allUserOrders;


        const { sell: userSellOrders, buy: userBuyOrders } = filterOrders(allUserOrders);

        // if(BuyHandler && userBuyOrders.length > 0) 
        //     await BuyHandler.process(userBuyOrders, this.#user.slug);

        if(SellHandler && userSellOrders.length > 0) 
            await SellHandler.process(userSellOrders, this.#user.slug);

    }
}
