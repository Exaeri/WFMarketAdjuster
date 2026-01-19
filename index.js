import mainHandler from "./handlers/main.js";
import config from "./config/adjuster.config.js";
import delay from "./utils/delay.js";
import clsColor from "./utils/clsColor.js";

let isActive = true;
const interval = config.delays.mainProcess || 2000;

await mainHandler.authWFM();
mainHandler.configInit();

console.log(`\n${clsColor.FgBlue}Process started:${clsColor.Reset}`);
console.log(`----------------`);
while (isActive) {
    await mainHandler.process();
    await delay(interval);
}

process.on('SIGINT', () => {
    console.log('Stopping process...');
    isActive = false;
});

process.on('SIGTERM', () => {
    console.log('Stopping process...');
    isActive = false;
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception:`, err);
});

process.on('unhandledRejection', (reason) => {
  console.error(`Unhandled Rejection:`, reason);
});
