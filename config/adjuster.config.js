const config = {
    delays: {
        WFMApi: 400,
        handlersStep: 200,
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
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0 (Edition Yx GX)'
}

export default config;