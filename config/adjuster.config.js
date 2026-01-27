const config = {
    delays: {
        WFMApi: 500,
        handlersStep: 250,
        mainProcess: 2000
    },
    handlers: {
        buy: true,
        sell: true
    },
    msgBoxNotify: {
        enabled: true,
        cooldown: 5000
    },
    sellHandler : {
        allowPriceChange: true,
        reductionLimit: 2,
        limitGrowing: true
    }
}

export default config;