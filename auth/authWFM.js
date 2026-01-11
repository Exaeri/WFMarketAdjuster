import WFMApi from "../WFMApi/WFMApi.js";
import { readJSON, clsColor} from "../utils/utils.js";

const tokenPath = './auth/jwtToken.json';

/**
 * Authenticates the user in warframe.market API using a JWT token.
 *
 * Reads JWT token from a local JSON file.
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
export default async function authWFM() {
    const userJWT = await readJSON(tokenPath);

    if(typeof userJWT.key !== 'string' || userJWT.key.length === 0) 
        throw new Error(`${clsColor.FgYellow}JWT${clsColor.Reset} must be a non-empty string (${tokenPath})`);
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