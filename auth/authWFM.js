import WFMApi from "../WFMApi/WFMApi.js";
import { readJSON, clsColor} from "../utils/utils.js";

const tokenPath = './auth/jwtToken.json';
export default async function authWFM() {
    const userJWT = await readJSON(tokenPath);

    if(typeof userJWT.key !== 'string') 
        throw new Error(`${clsColor.FgYellow}JWT${clsColor.Reset} must be string (${tokenPath})`);
    if(userJWT.key.length === 0) 
        throw new Error(`${clsColor.FgYellow}JWT${clsColor.Reset} must not be empty (${tokenPath})`);
    if(userJWT.key === 'YOUR_JWT') 
        throw new Error(`Replace ${clsColor.FgYellow}YOUR_JWT${clsColor.Reset} with your JWT in \x1b[33m${tokenPath}\x1b[0m`);

    WFMApi.JWT = userJWT.key;
    let userProfile;
    try {
        userProfile = await WFMApi.getMyProfile()
    } catch (err) {
        console.error(err.message);
        process.exit(1)
    }

    console.log(`${clsColor.FgGreen}[+]${clsColor.Reset} Success: authenticated as ${clsColor.FgGreen}${userProfile.slug}${clsColor.Reset}`);

    return userProfile.slug;
}