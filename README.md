WFMarketAdjuster is an automated assistant for managing your orders on warframe.market. <br>
It continuously monitors your buy/sell orders, compares them with current market offers, and automatically adjusts prices according to configurable rules and limits.

![wa](https://github.com/user-attachments/assets/10348fd0-d3ea-4c1e-8fac-8866e8763e42)

<h3>🚀Features</h3>

✔ Uses Warframe.Market API v2<br>
✔ Designed as a long-running process<br>
✔ Filters orders by item rank (for mods/arcanes)<br>
✔ Localization-ready log messages<br>
✔ Optional Windows PowerShell MessageBox notifications<br>

✔ BuyHandler<ul>
<li>Detects profitable sell offers</li>
<li>Notifies the user</li>
<li>Uses skip-list to avoid duplicate notifications</li>
</ul>
✔ SellHandler<ul>
<li>Automatically increases or decreases sell prices</li>
<li>Enforces price reduction limits based on initial order price</li>
<li>Supports dynamic reduction limit growth for expensive items</li>
</ul>

<h3>Requirements</h3>
Node.js (recommended: Node 18+)<br>
Git (required for submodules)<br>
Windows (only if you want MessageBox notifications)

<h3>📦Installation</h3>
1. <code>git clone --recursive https://github.com/Exaeri/WFMarketAdjuster.git</code><br><br>
2. Run installer (install.bat) OR do the installation manually by steps 2.1-2.3<br>
2.1 If you forgot --recursive, you have to install submodule:<br>
<code>cd .\WFMarketAdjuster\</code><br>
<code>git submodule update --init --recursive</code><br>
2.2 Install WFMarketApi dependencies:<br>
<code>cd .\WFMApi\</code><br>
<code>npm install</code><br>
2.3 Rename config/userJWT.example.js to config/userJWT.js<br><br>
3. Configure config/userJWT.js by adding your JWT from browser storage<br>

<h3>Configuration</h3>
All configuration files are located in the config/ directory.<br><br>
adjuster.config.js Key options:<br>
<code>delays.WFMApi</code>	API request cooldown (ms)<br>
<code>delays.mainProcess</code>	Delay between script's iterations<br>
<code>delays.handlersStep</code>	Delay between one user's order handling<br>
<code>handlers.buy</code>	Enable BuyHandler<br>
<code>handlers.sell</code>	Enable SellHandler<br>
<code>msgBoxNotify.enabled</code>	Enable Window's message boxes for notifying (disable it on Linux/macOS)<br>
<code>msgBoxNotify.cooldown</code>	MessageBox cooldown to show<br>
<code>sellHandler.allowPriceChange</code>	Allow script to changing user's prices
<code>sellHandler.reductionLimit</code>	Base price reduction limit<br>
<code>sellHandler.limitGrowing</code>	Increase reduction limit for expensive items<br>
limitGrowing logic:<br>
price ≤ 20 → reductionLimit<br>
price 21–100 → reductionLimit + 1<br>
price > 100 → reductionLimit + 2<br><br>

logsMessages.js configure logs messages, their colors and etc

<h3>Usage</h3>
One of the following methods:<br>
Run start.bat<br>
<code>node index.js</code><br>
<code>npm start</code>


