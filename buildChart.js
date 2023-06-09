import {
    createChart
} from "lightweight-charts";
import {
    fetchStockData
} from './importStockData.js';
const techIndicators = require('technicalindicators');
import {
    nextDay
} from './live.js';
import {
    cleanData
} from './formatData.js';




const buildChart = function(chart, chart2, finalData) {


    const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350'
    });
    chart.timeScale()
        .applyOptions({
            barSpacing: 1,
            autoscale: true,
            borderVisible: false,
            visible: true,
            shiftVisibleRangeOnNewBar: true,
        });

    chart2.timeScale()
        .applyOptions({
            barSpacing: 1,
            autoscale: true,
            borderVisible: false,
            visible: true,
            shiftVisibleRangeOnNewBar: true,
        });
    chart2.timeScale()
        .applyOptions({
            barSpacing: 1,
            autoscale: true,
            borderVisible: false,
            visible: true,
            shiftVisibleRangeOnNewBar: true,
        });

    const close = finalData.map(obj => obj.close);
    const open = finalData.map(obj => obj.open);
    const high = finalData.map(obj => obj.high);
    const low = finalData.map(obj => obj.low);
    const volume = finalData.map(obj => obj.volume);
    const vwapInputs = {
        close: close,
        open: open,
        high: high,
        low: low,
        volume: volume
    }
    const stochInputs = {
        period: 14,
        close: close,
        high: high,
        low: low,
        signalPeriod: 3
    }
    const Indicators = {
        SMA50: {
            period_offset: 50,
            valuesArray: techIndicators.sma({
                period: 50,
                values: close
            })
        },
        SMA100: {
            period_offset: 100,
            valuesArray: techIndicators.sma({
                period: 100,
                values: close
            })
        },
        SMA200: {
            period_offset: 200,
            valuesArray: techIndicators.sma({
                period: 200,
                values: close
            })
        },
        RSI: {
            period_offset: 14,
            valuesArray: techIndicators.RSI.calculate({
                period: 14,
                values: close
            })
        },
        VWAP: {
            period_offset: 0,
            valuesArray: techIndicators.vwap(vwapInputs)
        },
        STOCH: {
            period_offset: 14,
            valuesArray: techIndicators.Stochastic.calculate(stochInputs),
        }
    }


    for (let ind in Indicators) {
        Indicators[ind].valuesArray.unshift(...Array(Indicators[ind].period_offset)
            .fill(null));
    }
    for (let i = 0; i < finalData.length; i++) {
        for (let ind in Indicators) {
            finalData[i][ind] = Indicators[ind].valuesArray[i];
        }
    }
    chart2.timeScale()
        .fitContent()
    chart.applyOptions({
        height: (window.innerHeight * 0.40),
        width: (window.innerWidth)
    })
    chart2.applyOptions({
        height: (window.innerHeight * 0.20),
        width: (window.innerWidth)
    })

    addEventListener("resize", (event) => {});
    onresize = (event) => {
        chart.applyOptions({
            height: (window.innerHeight * 0.40),
            width: (window.innerWidth * 1)
        })

        chart2.applyOptions({
            height: (window.innerHeight * 0.20),
            width: (window.innerWidth * 1)
        })

    }
return {chart_main:chart, chart_second:chart2,main_data_series:candlestickSeries,data:finalData}
}

export async function mainBuildChart(element1, element2,ticker,api_key, ticks_per_bar, interval_ms, randomness) {
    try {
        let chartOptions = {

            layout: {
                background: {
                    color: "#111"
                },
                textColor: "white"
            },
            height: (window.innerWidth * 0.90),
            width: (window.innerWidth),

            grid: {
                vertLines: {
                    visible: true,
                    color: '#1a1a1a'
                },
                horzLines: {
                    visible: true,
                    color: '#1a1a1a'
                }
            },

            crosshair: {
                vertLine: {
                    width: 1,
                    color: 'white',
                    labelBackgroundColor: '#1a1a1a',
                },
                horzLine: {
                    width: 1,
                    color: 'white',
                    labelBackgroundColor: '#1a1a1a',
                },
            },

            handleScroll: {
                horzTouchDrag: true,
                mouseWheel: true,
                pressedMouseMove: true,
                vertTouchDrag: true,
            },

            handleScale: {
                axisDoubleClickReset: {
                    time: true,
                    price: true
                },
                axisPressedMouseMove: {
                    time: true,
                    price: true
                },
                mouseWheel: true,
                pinch: true
            },

            rightPriceScale: {
                alignLabels: true,
                autoScale: true,
                visible: true,
                borderVisible: false,
                textColor: 'white'
            },

            leftPriceScale: {
                alignLabels: true,
                autoScale: true,
            },

            kineticScroll: {
                touch: true
            }
        };
        let chartLockOptions = {

            layout: {
                background: {
                    color: "#111"
                },
                textColor: "white"
            },
            height: (window.innerWidth * 0.90),
            width: (window.innerWidth),

            grid: {
                vertLines: {
                    visible: true,
                    color: '#1a1a1a'
                },
                horzLines: {
                    visible: true,
                    color: '#1a1a1a'
                }
            },

            crosshair: {
                vertLine: {
                    width: 1,
                    color: 'white',
                    labelBackgroundColor: '#1a1a1a',
                },
                horzLine: {
                    width: 1,
                    color: 'white',
                    labelBackgroundColor: '#1a1a1a',
                },
            },

            handleScroll: {
                horzTouchDrag: false,
                mouseWheel: false,
                pressedMouseMove: false,
                vertTouchDrag: false,
            },

            handleScale: {
                axisDoubleClickReset: {
                    time: false,
                    price: false
                },
                axisPressedMouseMove: {
                    time: false,
                    price: false
                },
                mouseWheel: false,
                pinch: false
            },

            rightPriceScale: {
                alignLabels: true,
                autoScale: true,
                visible: true,
                borderVisible: false,
                textColor: 'white'
            },

            leftPriceScale: {
                alignLabels: true,
                autoScale: true,
            },

            kineticScroll: {
                touch: true
            }
        };

        const data = await fetchStockData(ticker,api_key);
        const charts_with_data = buildChart(createChart(document.getElementById(element1), chartOptions), createChart(document.getElementById(element2), chartLockOptions), cleanData(data));
        nextDay(charts_with_data.main_data_series,cleanData(data),charts_with_data.chart_main,charts_with_data.chart_second,ticks_per_bar,interval_ms,randomness)
    } catch (error) {
      alert(`${error.name}:${error.message}`);
    }

}
