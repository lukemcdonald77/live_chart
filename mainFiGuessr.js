const { mainBuildChart } = require('./contain/buildChart.js');


/*

    Element 1 and 2 MUST be the id of the <div> elements you would like the charts to be contained within. Ticker is any regular stock ticker (subject to the limitations of 
    AlphaVantage's API. ticks_per_bar dictates the amount of random ticks per bar of REAL data provided. interval_ms dictates the rate that data will be updated - accordingly,
    there is a balance between ticks_per_bar and interval_ms that will provide the desired look. Lastly, randomness is the degree that simulated data/noise will be impacted by.
                                                                                                                                                                                    */

mainBuildChart(element1 = "mainFiGuessrContainer", element2 = "coFiGuessrContainer", ticker = "AAPL", api_key = "9DJ4WN9S42R1PQET",ticks_per_bar = 40,interval_ms = 100,randomness = 1)



