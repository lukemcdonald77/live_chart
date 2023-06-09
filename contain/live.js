const techIndicators = require('technicalindicators');
export function nextDay(main_series, data,chart_main,chart_second,ticks_per_bar,interval_ms,randomness) {
    ticks_per_bar = ticks_per_bar || 20
    interval_ms = interval_ms || 50
    randomness = randomness || 1
    chart = chart_main
    chart2 = chart_second
    var candleSeries = main_series

    const generateTechIndicatorsData = () => {
        const close = data.map(obj => obj.close);
        const open = data.map(obj => obj.open);
        const high = data.map(obj => obj.high);
        const low = data.map(obj => obj.low);
        const volume = data.map(obj => obj.volume);
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
                valuesArray: techIndicators.vwap({
                    close: close,
                    open: open,
                    high: high,
                    low: low,
                    volume: volume
                })
            },
            STOCH: {
                period_offset: 14,
                valuesArray: techIndicators.Stochastic.calculate({
                    period: 14,
                    close: close,
                    high: high,
                    low: low,
                    signalPeriod: 3
                }),
            }
        }


        for (let ind in Indicators) {
            Indicators[ind].valuesArray.unshift(...Array(Indicators[ind].period_offset)
                .fill());
        }
        for (let i = 0; i < data.length; i++) {
            for (let ind in Indicators) {
                data[i][ind] = Indicators[ind].valuesArray[i];
            }
        }
    return Indicators
    };

    Indicators = generateTechIndicatorsData()

    const generateIndicatorCharts = () => {
            const generated_tech_indicators = {
              SMA50: {
                config: chart.addLineSeries({
                  color: "rgba(245, 39, 39, 0.7)",
                  lineWidth: 1
                }),
              },
              SMA100: {
                config: chart.addLineSeries({
                  color: "rgba(243, 245, 39, 0.7)",
                  lineWidth: 1
                }),
              },
              SMA200: {
                config: chart.addLineSeries({
                  color: "rgba(39, 50, 245, 0.7)",
                  lineWidth: 1
                }),
              },
              RSI: {
                config: chart2.addLineSeries({
                  color: "rgba(255, 255, 255, 0.7)",
                  lineWidth: 1
                }),
              },
              VWAP: {
                config: chart.addLineSeries({
                  color: "rgba(255, 0, 191, 0.7)",
                  lineWidth: 1
                }),
              },
              STOCH: {
                config: chart2.addLineSeries({
                  color: "rgba(255, 102, 0, 0.7)",
                  lineWidth: 1
                }),
              },
            };
            return generated_tech_indicators;
          };
    const generated_tech_indicators = generateIndicatorCharts()


    Object.values(generated_tech_indicators).forEach(indicator => {
        indicator.config.applyOptions({
            visible: false
    })})

    candleSeries.setData([]);


let eventHandler = function(name) {
        return function() {
            let function_type = name
            let item = arguments[0]
            const techIndicatorName = item
            const techIndicator = generated_tech_indicators[techIndicatorName];
            if (function_type == "onItemAdd") {
                techIndicator.config.applyOptions({
                    visible: true
                });
                console.log("added")
            } else {
                techIndicator.config.applyOptions({
                    visible: false
                });
                console.log("removed")
            }
        };
    };
    function onVisibleLogicalRangeChanged(newVisibleLogicalRange) {
        chart2.timeScale()
            .setVisibleLogicalRange(newVisibleLogicalRange);
    }

    chart.timeScale()
        .subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);
    let $select = $('#search')
    .selectize({
        plugins: ["remove_button"],
        maxItems: null,
        valueField: 'id',
        labelField: 'title',
        searchField: 'title',
        options: Object.keys(generated_tech_indicators)
            .map((key) => ({
                id: key,
                title: key.split("_")[0].replace("_", " "),
            })),
        create: false,
        onItemAdd: eventHandler('onItemAdd'),
        onItemRemove: eventHandler('onItemRemove'),

    });
    function extractIndicatorData(data, indicators) {
        const extractedData = {};

        for (const key in indicators) {
          if (indicators.hasOwnProperty(key)) {
            if (key == "STOCH"){
                extractedData[key] = {
                    close: data.close,
                    high: data.high,
                    low: data.low,
                    signalPeriod: 3
                }
                try{extractedData[key] = {
                    value: data[key]["k"],
                    time: data.time
                  }}
                catch{extractedData[key] = {
                    value: data[key],
                    time: data.time
                  }
                }
            }
            else{
            if (key == "VWAP"){
                extractedData[key] = {
                    close: data.close,
                    open: data.open,
                    high: data.high,
                    low: data.low,
                    volume: data.volume
                }
            }

            extractedData[key] = {
              value: data[key],
              time: data.time
            }
        }
            generated_tech_indicators[key].config.update(extractedData[key]);


          }
        }
      }

      function addIntradayNoise(datapoint, magnitude) {
        const noise = (Math.random() - 0.5) * magnitude; // Generate random noise within a range
        return {
          ...datapoint,
          open: datapoint.open,
          high: Math.max((datapoint.high + 0.20*noise),datapoint.high),
          low: Math.min((datapoint.low + 0.20*noise),datapoint.low),
          close: datapoint.close + noise,
        };
      }


      let ticks = 0;
      let currentIndex = 0;
      let noisedData;

      setInterval(function() {
        if (currentIndex < data.length) {
          if (ticks++ === ticks_per_bar) {
            currentIndex++;
            ticks = 0;
            noisedData = addIntradayNoise(data[currentIndex], randomness)
            noisedData.close=data[currentIndex+1].open
          } else {
            if (ticks == 0) {
              noisedData = data[currentIndex];
            } else {
              if (currentIndex == 0){
                noisedData = data[currentIndex];
              }else{
                noisedData = addIntradayNoise(data[currentIndex],randomness);
              }
            }
            candleSeries.update(noisedData);
            extractIndicatorData(noisedData, Indicators);
            ticks++;
          }
        }
      }, interval_ms);


    }
