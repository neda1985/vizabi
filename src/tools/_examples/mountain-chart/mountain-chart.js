define([
    'lodash',
    'base/tool'
], function(_, Tool) {

    var mountainChart = Tool.extend({

        /**
         * Initialized the tool
         * @param config tool configurations, such as placeholder div
         * @param options tool options, such as state, data, etc
         */
        init: function(config, options) {

            this.name = 'mountain-chart';
            this.template = "tools/_examples/mountain-chart/mountain-chart";

            //instantiating components
            this.components = [{
                component: '_gapminder/header',
                placeholder: '.vzb-tool-title'
            }, {
                component: '_examples/mountain-chart',
                placeholder: '.vzb-tool-viz', //div to render
                model: ["state.time", "state.entities", "state.marker", "data"]
            }, {
                component: '_gapminder/timeslider',
                placeholder: '.vzb-tool-timeslider', //div to render
                model: ["state.time"]
            }, {
                component: '_gapminder/buttonlist',
                placeholder: '.vzb-tool-buttonlist',
                model: ['state', 'data', 'language'],
                buttons: ['colors', 'size', 'more-options']
            }];

            this._super(config, options);

        },

        /**
         * Validating the tool model
         * @param model the current tool model to be validated
         */
        toolModelValidation: function(model) {

            var time = model.state.time,
                markers = model.state.marker.label;

            //don't validate anything if data hasn't been loaded
            if (!markers.getItems() || markers.getItems().length < 1) {
                return;
            }

            var dateMin = markers.getLimits('time').min,
                dateMax = markers.getLimits('time').max;

            if (time.start < dateMin) {
                time.start = dateMin;
            }
            if (time.end > dateMax) {
                time.end = dateMax;
            }
        }
    });

    return mountainChart;
});