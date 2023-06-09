export function cleanData(jsonData) {
    dataArray = []
    for (const date in jsonData["Time Series (Daily)"]) {
        const data = jsonData["Time Series (Daily)"][date];
        const timestamp = new Date(date)
            .getTime() / 1000;
        const obj = {
            open: parseFloat(data["1. open"]),
            high: parseFloat(data["2. high"]),
            low: parseFloat(data["3. low"]),
            close: parseFloat(data["4. close"]),
            adj_close: parseFloat(data["5. adjusted close"]),
            volume: parseFloat(data["6. volume"]),
            time: timestamp,
        };
        dataArray.push(obj);
    }
    const preLimData = dataArray.reverse()
    return preLimData
}