define([
        'jquery',
        'bubble-chart-model',
        'viz-bubble',
        'time-slider-jQueryUI',
        'settings-button',
        'chart-grid',
        'bubble-chart-components',
        'i18n'
    ],
    function($, bubbleChartModel, vizBubble, timeSlider, settingsButton, chartGrid, components) {
        // supposed to be available at window.vizabi.bubbleChart
        var bubbleChart = function(renderDiv, state) {
            var isInteractive;
            var _vizBubble;
            var model;
            var appSVG;
            var _timeSlider;
            var _vizChart;
            var chartScales;
            var availableFrame;
            var modelBindCallback;
            var placeholderDivIds = {
                slider: undefined,
                trails: undefined,
                playImage: undefined
            };
            var enableManualZoom;
            var _i18n;

            var svg;
            var chartRenderDiv = renderDiv + "-scatterChart";

            var defaultMeasures = {
                width: 900,
                height: 500
            };

            var currentMeasures = {
                width: '100%',
                height: '100%'
            };

            var drawSvgLayer = function() {
                svg = d3.select("#" + renderDiv)
                    .append("svg")
                    .attr("id", chartRenderDiv)
                    .attr("xmlns", "http://www.w3.org/2000/svg")
                    .attr("version", "1.1")
                    .classed("chart", true)
                    .classed("scatter", true)
                    .style({
                        display: "block"
                    });
            };

            var setInitialState = function(state) {
                model = new bubbleChartModel();
                drawSvgLayer();
                initComponents();

                model.setInit(state, function() {
                    isInteractive = model.get("isInteractive");
                    setUpSubviews();
                    setUpModelAndUpdate();
                    if (model.get("manualZoom")) {
                        setZoom();
                    }
                    if (modelBindCallback) {
                        modelBindCallback(model.getAttributes());
                    }
                });

                seti18n();
            };

            var setState = function(state) {
                model.set(state, function() {
                    isInteractive = model.get("isInteractive");
                    setUpModelAndUpdate();
                    if (modelBindCallback) {
                        modelBindCallback(model.getAttributes());
                    }
                });
            };

            var seti18n = function() {
                var language = model.get("language");
                var fn = model.get("i18nfn");

                _i18n = fn ? fn : i18n.instance();

                if (language && language !== 'dev') {
                    setLanguage(language);
                }
            };

            var setLanguage = function(lang, callback) {
                var filename = 0;
                _i18n.setLanguage(lang, filename, callback);
            };

            var setUpModelAndUpdate = function() {
                var year = model.get("year");
                var trails = model.get("trails");

                if (isInteractive) {
                    _timeSlider.update(model);
                }

                chartScales = _vizChart.updateLayout(model);
                availableFrame = _vizChart.getAvailableHeightAndWidth();
                _vizBubble.update(model, chartScales, availableFrame);
            };


            var setUpSubviews = function() {
                initializeLayers(scatterChartModelUpdate);
                initializeScatterChart(renderDiv);
                initializeTimeSlider(isInteractive);
            };


            var initializeScatterChart = function(svg, renderDiv) {
                var _vizBubblePrint;

                _vizBubble = new vizBubble(scatterChartModelUpdate);

                _vizChart = new chartGrid();
                _vizChart.initializeLayers(renderDiv, components.get());

                if (!isInteractive) {
                    _vizBubblePrint = new gapminder.viz.vizBubblePrint(chartRenderDiv, vizState, vizStateChangeCallback);
                    _vizBubblePrint.registerClickEventListerners();
                    _vizBubblePrint.registerAlignButtonsEventListeners();
                }

                _vizBubble.initialize(renderDiv, model, components.get());
            };

            var initializeTimeSlider = function(isInteractive) {
                if (isInteractive) {
                    createTimeSlider();
                    _timeSlider = new timeSlider(timeSliderModelUpdate);
                    _timeSlider.initialize(model, getDivId("slider"));
                    _timeSlider.setupListeners();
                }
            };


            var scatterChartModelUpdate = function(state) {
                model.set(state, function() {
                    _vizBubble.update(model, chartScales, availableFrame);
                    if (modelBindCallback) {
                        modelBindCallback(model.getAttributes());
                    }
                });

            };

            var timeSliderModelUpdate = function(state) {
                model.set(state, function() {
                    _timeSlider.update(model);
                    _vizChart.updateLayout(model);
                    _vizBubble.update(model, chartScales, availableFrame);
                    if (modelBindCallback) {
                        modelBindCallback(model.getAttributes());
                    }
                });
            };


            var initComponents = function() {
                components.init(svg, model, scatterChartModelUpdate);
            };

            var initLayouts = function() {
                var _bubbleChartLayout = new bubbleChartLayout();
                _bubbleChartLayout.init(components);
            };

            var initLayoutManager = function () {
                lm.init(svg, defaultMeasures, currentMeasures);
                lm.divScale();
            };

        var initComponents = function() {
            components.init(svg, model);
        };


            /* GUI Layer Creator */
            var initializeLayers = function(changeCallback) {
                var appRenderDiv = document.getElementById(renderDiv);

                setDivId("labelForYear", "label-year-" + renderDiv);
            };

            var createTimeSlider = function() {
                var appRenderDiv = document.getElementById(renderDiv);

                setDivId("slider", "slider-" + renderDiv);
                var sliderDiv = document.createElement("div");
                sliderDiv.id = getDivId("slider");
                appRenderDiv.appendChild(sliderDiv);

                var sliderPlayDiv = document.createElement("div");
                sliderPlayDiv.className = "G_widget_slider_play";
                sliderPlayDiv.style.width = "40px";
                sliderPlayDiv.style.float = "left";
                sliderDiv.appendChild(sliderPlayDiv);

                var imageParent = document.getElementById(getDivId("slider")).getElementsByClassName("G_widget_slider_play")[0];
                setDivId("playImage", "image-" + renderDiv);
                var playImage = document.createElement("img");
                playImage.className = "play-button";
                playImage.src = "tools/bubble-chart/images/play.png"; // TODO: Do not include src here, the className is enough. Move src to css as url()
                imageParent.appendChild(playImage);

                var sliderWidgetDiv = document.createElement("div");
                sliderWidgetDiv.className = "G_widget_slider";
                sliderWidgetDiv.style.marginLeft = "50px";
                sliderDiv.appendChild(sliderWidgetDiv);

                var sliderWidgetScale = document.createElement("div");
                sliderWidgetScale.className = "G_widget_slider_scale";
                sliderWidgetScale.style.marginLeft = "50px";
                sliderWidgetScale.style.marginTop = "10px";
                sliderWidgetScale.style.position = "relative";
                sliderDiv.appendChild(sliderWidgetScale);
            };

            var getDivId = function(divName) {
                return placeholderDivIds[divName];
            };

            var setDivId = function(divName, divId) {
                placeholderDivIds[divName] = divId;
            };

            var setZoom = function() {
                var g = d3.select("#" + renderDiv).select("g");
                var xScale = _vizChart.getXScale();
                var yScale = _vizChart.getYScale();

                var zoom = d3.behavior.zoom()
                    .on("zoom", function() {
                        zoomed(xScale, yScale, zoom.scale())
                    });

                g.call(zoom);
            };

            var zoomed = function(xScale, yScale, zoomScale) {
                _vizChart.updateLayout(model, zoomScale);
                var availableFrame = _vizChart.getAvailableHeightAndWidth();
                var xScale = _vizChart.getXScale();
                var yScale = _vizChart.getYScale();

                _vizBubble.update(model, [xScale, yScale], availableFrame);
            };

            setInitialState(state);

            return {
                setVizabiState: setInitialState,
                setState: setState,
                setInitialState: setInitialState,
                setLanguage: setLanguage
            };
        };

        return bubbleChart;
    }
);
