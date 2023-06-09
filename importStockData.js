export async function fetchStockData(ticker,api_key) {
    const alpha = require('alphavantage')({ key: api_key });
    const data = await alpha.data.daily_adjusted(`${ticker}`,`full`,`json`,)
    return data
}