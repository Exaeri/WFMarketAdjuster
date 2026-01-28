const config = {
    delays: {
        WFMApi: 400,
        handlersStep: 100,
        mainProcess: 500
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