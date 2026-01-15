import WFMApi from "../WFMApi/WFMApi.js";
import filterOrders from "../utils/filterOrders.js";
import config from "../config/adjuster.config.js";
import {spawn} from 'child_process';
export default class SellBuyBase {
    static _skipList = new Set();
    static _handlerInterval = config?.delays?.handlersStep || 1000;
    static _messageBox = {
        enabled: config?.msgBoxNotify?.enabled || false, 
        lastCallTime: 0, 
        cooldown: config?.msgBoxNotify?.cooldown || 3000
    };
    static _logsLang = 'en';

    static set language(lang) {
        this._logsLang = lang;
    }

    static get language() {
        return this._logsLang;
    }

    static _messageBoxShow(message) {
        if(!this._messageBox.enabled) return;

        const currentTime = Date.now();
        if (currentTime - this._messageBox.lastCallTime < this._messageBox.cooldown) return;
        this._messageBox.lastCallTime = currentTime; 

        const command = `
        Add-Type -AssemblyName PresentationCore,PresentationFramework,PresentationFramework;
        [System.Media.SystemSounds]::Beep.Play();
        $window = New-Object System.Windows.Window;
        $window.Topmost = $true;
        $window.WindowStartupLocation = 'CenterScreen';
        $window.Title = 'WFM Adjuster - BuyHandler';
        $window.SizeToContent = 'Width';
        $window.Height = 100;  # set height
        $window.ResizeMode = 'NoResize';

        $textBlock = New-Object System.Windows.Controls.TextBlock;
        $textBlock.Text = '${message}';
        $textBlock.Margin = '5';

        $button = New-Object System.Windows.Controls.Button;
        $button.Content = 'Ok';
        $button.Margin = '5';
        $button.Width = 100;
        $button.Add_Click({ $window.Close() });

        $stackPanel = New-Object System.Windows.Controls.StackPanel;
        $stackPanel.Children.Add($textBlock);
        $stackPanel.Children.Add($button);
        $window.Content = $stackPanel;

        $window.ShowDialog() | Out-Null;
        `;
        spawn("powershell.exe", ["-Command", command]);
    } 

    static async _parseAndFilter(order) {
        const itemSlug = await WFMApi.getItemSlugById(order.itemId);
        const itemName = await WFMApi.getItemNameBySlug(itemSlug);

        let allItemOrders;
        try {
            allItemOrders = await WFMApi.getItemOrders(itemSlug);
        }
        catch (err) {
            console.error(`Error while fetching orders for item: ${itemName}`, err);
            return; 
        }
        if(!allItemOrders || allItemOrders.length === 0) {
            console.warn(`No orders found for item: ${itemName}`);
            return;
        }
        const { sell: itemSellOrders, buy: itemBuyOrders } = filterOrders(allItemOrders, { filterStatus: 'ingame', filterRank: order.rank });
        return { itemName, itemSellOrders, itemBuyOrders };
    }

    static async process() {
        throw new Error('process() must be used in subclass');
    }
}