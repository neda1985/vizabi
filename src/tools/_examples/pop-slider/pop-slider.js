define([
    'd3',
    'lodash',
    'base/tool'
], function(d3, _, Tool) {

    var popSlider = Tool.extend({

        /**
         * Initialized the tool
         * @param config tool configurations, such as placeholder div
         * @param options tool options, such as state, data, etc
         */
        init: function(config, options) {

            this.name = 'pop-slider';
            this.template = "tools/_examples/pop-slider/pop-slider";

            //instantiating components
            this.components = [{
                component: '_examples/year-display',
                placeholder: '.vzb-tool-year', //div to render
                model: ["state.time"]
            }, {
                component: '_examples/indicator-display',
                placeholder: '.vzb-tool-display', //div to render
                model: ["state.show", "data", "state.time"]
            }, {
                component: '_gapminder/timeslider',
                placeholder: '.vzb-tool-timeslider', //div to render
                model: ["state.time"]
            }];

            this._super(config, options);
        },

        /**
         * Validating the tool model
         * @param model the current tool model to be validated
         */
        toolModelValidation: function(model) {

            var state = model.state;
            var data = model.data;

            //don't validate anything if data hasn't been loaded
            if (!data.getItems() || data.getItems().length < 1) {
                return;
            }

            var dateMin = data.getLimits('time').min,
                dateMax = data.getLimits('time').max;
                
            if (state.time.start < dateMin) {
                state.time.start = dateMin;
            }
            if (state.time.end > dateMax) {
                state.time.end = dateMax;
            }
        },

        /**
         * Returns the query (or queries) to be performed by this tool
         * @param model the tool model will be received
         */
        getQuery: function(model) {
            return [{
                "from": "data",
                "select": ["geo", "geo.name"],
                "where": {
                    "geo": ["*"],
                    "geo.region": ["afr"],
                }
            }];
        }

    });


    return popSlider;
});