const config = require('./config')
const binance = require('node-binance-api')().options({
    APIKEY: config.API_KEY,
    APISECRET: config.SECRET_KEY,
    useServerTime: true
});

setInterval(function () {
    binance.balance((error, balances) => {
        if (error) return console.error(error);
        const total = parseFloat(balances.USDT.onOrder) + parseFloat(balances.USDT.available) + parseFloat(balances.TUSD.onOrder) + parseFloat(balances.TUSD.available)
        console.log("TOTAL BALANCE : ", total, "USD")
        console.log("INITIAL BALANCE : ", config.INITIAL_INVESTMENT, "USD")
        console.log("GAINS : ", total - config.INITIAL_INVESTMENT, "USD")
        var buy = 0.9985;
        var sell = 1.0030;
        binance.prices((error, ticker) => {
            console.log("Price of BTC: ", ticker.BTCUSDT);
        });
        binance.prevDay("BTCUSDT", (error, prevDay, symbol) => {
            if (prevDay.priceChangePercent > 0) {
                buy = 0.9920;
                sell = 0.9965;
            } else {
                buy = 0, 9980;
                sell = 1, 0020;
            }
            console.log("Entre achat " + buy + " et vente " + sell);
            if (balances.USDT.available > 20) {
                console.log("Achat : " + buy);
                binance.buy("TUSDUSDT", ((balances.USDT.available - 0.1) / buy).toFixed(2), buy);
            }
            if (balances.TUSD.available > 20) {
                console.log("Vente : " + sell);
                binance.sell("TUSDUSDT", (balances.TUSD.available - 0.1).toFixed(2), sell);
            }
        });
    });
}, 3000)
