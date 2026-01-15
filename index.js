import mainHandler from "./handlers/main.js";

await mainHandler.authWFM();
mainHandler.configInit();
await mainHandler.process();

// setTimeout(() => {}, 2000);

// let userInfo;
// try {
//     userInfo = await WFMApi.getUserPublicInfo(userSlug);
// } catch (err) {
//     console.error(err.message);
// }

// WFMApiConfigure(userInfo);
// mainHandler.init();
// mainHandler.process(userInfo);

