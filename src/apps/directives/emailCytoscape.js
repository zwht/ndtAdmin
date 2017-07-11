/**
 * Created by zhaowei on 16/12/27.
 */
var md = require("../module/app");
md.directive('emailCytoscape', ["$parse", "taskServer",
    function ($parse, $scope, taskServer) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                changeData: "=",
                loadingShow: "="
            },
            templateUrl: 'page/directives/emailCytoscape.html',
            compile: function (tElem, tAttrs) {
                return {
                    pre: function (scope, iElem, iAttrs) {
                    },
                    post: function (scope, iElem, iAttrs) {
                        var elem = $(iElem);
                        var cy = {};
                        var data = {};
                        var emailToIdx = {};
                        var allNodes = null;
                        var allEdges = null;
                        var allEles = null;
                        var lastHighlighted = null;
                        var lastUnhighlighted = null;
                        var algorithmsName = "";

                        var aniDur = 500;
                        var easing = 'linear';

                        var maxPr = 0;//pageRank最大值
                        var maxSize = 30;//最大点
                        var minSize = 5;
                        var maxWeight = 0;
                        var colorArr = ["#999", "#999", "#00ab3b", "#3effa6", "#ffed7c", "#ffdc00", "#ff5700", "#ff5700", "#ff5700", "#ff5700"];


                        scope.$watch("changeData", function (n, o) {
                            if (n) {
                                maxPr = 0;
                                emailToIdx = {};
                                allNodes = null;
                                allEdges = null;
                                allEles = null;
                                lastHighlighted = null;
                                lastUnhighlighted = null;
                                data = $parse(iAttrs.emailCytoscape)(scope.$parent);
                                algorithmsName = data.algorithmsName;
                                setData(data);
                            }
                        });


                        //初始化数据
                        function setData(op) {

                            var elements = [];
                            angular.forEach(op.nodes, function (item, index) {
                                var json = {
                                    // group: "nodes",
                                    data: {
                                        id: index,
                                        email: item.id,
                                        rank: 1
                                    }
                                };
                                emailToIdx[item.id] = index;
                                elements.push(json);
                            });
                            angular.forEach(op.edges, function (item, index) {
                                var json = {
                                    // group: "edges",
                                    data: {
                                        id: "e" + index,
                                        source: emailToIdx[item.srdId],
                                        target: emailToIdx[item.dstId],
                                        attrs: item.attrs,
                                        weight: item.attrs.connectTimes,
                                    }
                                };
                                if (maxWeight < json.data.weight) {
                                    maxWeight = json.data.weight
                                }
                                elements.push(json);
                            });
                            initChart(elements)
                        }

                        //渲染图表
                        function initChart(elements, target) {

                            var cose = {
                                name: 'cose',

                                // Called on `layoutready`
                                ready: function () {
                                    scope.loadingShow = false;
                                    scope.$apply();

                                },

                                // Called on `layoutstop`
                                stop: setInitPosition,

                                // Whether to animate while running the layout
                                animate: true,

                                // The layout animates only after this many milliseconds
                                // (prevents flashing on fast runs)
                                animationThreshold: 500,

                                // Number of iterations between consecutive screen positions update
                                // (0 -> only updated on the end)
                                refresh: 15,

                                // Whether to fit the network view after when done
                                fit: true,

                                // Padding on fit
                                padding: 5,

                                // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
                                // boundingBox: {x1:100,y1:100,x2:2000,y2:800},

                                // Randomize the initial positions of the nodes (true) or use existing positions (false)
                                randomize: true,

                                // Extra spacing between components in non-compound graphs
                                componentSpacing: 10,

                                // Node repulsion (non overlapping) multiplier
                                nodeRepulsion: function (node) {
                                    return 40000;
                                },

                                // Node repulsion (overlapping) multiplier
                                nodeOverlap: 5,

                                // Ideal edge (non nested) length
                                idealEdgeLength: function (edge) {
                                    return 10;
                                },

                                // Divisor to compute edge forces
                                edgeElasticity: function (edge) {
                                    return 10;
                                },

                                // Nesting factor (multiplier) to compute ideal edge length for nested edges
                                nestingFactor: 5,

                                // Gravity force (constant)
                                gravity: 80,

                                // Maximum number of iterations to perform
                                numIter: 2000,

                                // Initial temperature (maximum node displacement)
                                initialTemp: 50,

                                // Cooling factor (how the temperature is reduced between consecutive iterations
                                coolingFactor: 0.95,

                                // Lower temperature threshold (below this point the layout will end)
                                minTemp: 1.0,

                                // Whether to use threading to speed up the layout
                                useMultitasking: true
                            };


                            var concentric = {
                                name: 'concentric',

                                fit: true, // whether to fit the viewport to the graph
                                padding: 5, // the padding on fit
                                startAngle: 3 / 2 * Math.PI, // where nodes start in radians
                                sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
                                clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
                                equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
                                minNodeSpacing: 3, // min spacing between outside of nodes (used for radius adjustment)
                                boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
                                avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
                                height: undefined, // height of layout area (overrides container height)
                                width: undefined, // width of layout area (overrides container width)
                                concentric: function (node) { // returns numeric value for each node, placing higher nodes in levels towards the centre
                                    return node.degree();
                                },
                                levelWidth: function (nodes) { // the variation of concentric values in each level
                                    return nodes.maxDegree() / 4;
                                },
                                animate: true, // whether to transition the node positions
                                animationDuration: 500, // duration of animation in ms if enabled
                                animationEasing: undefined, // easing of animation if enabled
                                ready: undefined, // callback on layoutready
                                stop: undefined // callback on layoutstop
                            };
                            var style = [
                                {
                                    selector: 'node',
                                    style: {
                                        'background-color': '#ff5700',
                                        "content": "data(email)",
                                        'background-clip': 'none',
                                        'min-zoomed-font-size': 10,
                                        label: "data(email)",
                                        'font-size': 14,
                                        height: function (obj) {
                                            return getSize(obj._private.data.rank);
                                        },
                                        width: function (obj) {
                                            return getSize(obj._private.data.rank);
                                        }
                                    }
                                },
                                {
                                    selector: 'node.hover',
                                    style: {
                                        'border-width': 1,
                                        'border-style': 'solid',
                                        'border-color': '#FF9900',
                                        'background-color': '#FF9900',
                                        label: "data(email)",
                                        'font-size': 28,
                                        'text-max-width': 1,
                                        height: maxSize,
                                        width: maxSize

                                    }
                                },
                                {
                                    selector: ':parent',
                                    style: {
                                        'background-color': '#c00',
                                        'background-opacity': 0.5
                                    }
                                },

                                {
                                    selector: 'edge',
                                    style: {
                                        'width': 1,
                                        'opacity': 0.5,
                                        'line-color': '#a8eae5',
                                        'curve-style': 'bezier'
                                    }
                                },
                                {
                                    selector: 'edge.important',
                                    style: {
                                        'width': 2,
                                        'opacity': 1,
                                        'line-color': '#c00',
                                        'curve-style': 'bezier',
                                        'min-zoomed-font-size': 1,
                                        'font-size': 12,
                                        'label': "data(attrs.connectTimes)"
                                    }
                                },
                                {
                                    selector: 'edge.hover',
                                    style: {
                                        'border-width': 1,
                                        'border-style': 'solid',
                                        'border-color': '#FF9900',
                                        'background-color': '#FF9900',
                                        'width': 10,
                                        'opacity': 1,
                                        'font-size': 28,
                                        'line-color': '#FF9900',
                                        'curve-style': 'bezier',
                                        'label': "data(attrs.connectTimes)"
                                    }
                                },
                                {
                                    selector: 'edge.not-path',
                                    style: {
                                        opacity: 0.4
                                    }
                                },
                                {
                                    selector: 'edge.path',
                                    style: {
                                        width: 3,
                                        'line-color': '#6FB1FC'
                                    }
                                },
                                {
                                    selector: '.faded',
                                    style: {
                                        opacity: 0.1,
                                        'text-opacity': 0
                                    }
                                },
                                {
                                    selector: '.hidden',
                                    style: {
                                        display: 'none'
                                    }
                                },
                                {
                                    selector: '.highlighted',
                                    style: {
                                        opacity: 1,
                                        'text-opacity': 1,
                                        'font-size': 28
                                    }

                                }
                            ];
                            cy = cytoscape({
                                container: elem.find(".cytoscapeBox"),
                                pixelRatio: 1,
                                hideEdgesOnViewport: true,
                                textureOnViewport: true,
                                motionBlur: true,
                                motionBlurOpacity: true,
                                minZoom: 0.3,
                                maxZoom: 3,
                                autoungrabify: true,
                                layout: {name: 'null'},
                                ready: function () {

                                },
                                elements: elements,
                                //style: style
                            });


                            switch (algorithmsName) {
                                case("pageRank"):
                                    pageRank();
                                    //console.log("pageRank");
                                    break;
                                case("degreeCentrality"):
                                    degreeCentrality();
                                    //console.log("degreeCentrality");
                                    break;
                                case("closenessCentrality"):
                                    closenessCentrality();
                                    //console.log("closenessCentrality");
                                    break;
                                case("betweennessCentrality"):
                                    betweennessCentrality();
                                    //console.log("betweennessCentrality");
                                    break;
                            }
                            function pageRank() {
                                var pr = cy.elements().pageRank();
                                var maxNode;
                                /*    cy.nodes().forEach(function (n) {
                                 console.log(pr.rank('#' + n.data('id')));
                                 });*/
                                angular.forEach(elements, function (item, index) {
                                    if (item.data.rank != 0) {
                                        item.data.rank = parseInt(pr.rank('#' + item.data.id) * 10000);
                                        if (maxPr < item.data.rank) {
                                            maxPr = item.data.rank;
                                            maxNode = item
                                        }
                                    }
                                });
                            }

                            //degreeCentrality
                            function degreeCentrality() {
                                var dcn = cy.$().dcn();
                                var maxNode;
                                /*  cy.nodes().forEach(function (n) {
                                 console.log(dcn.degree('#' + n.data('id')));
                                 });*/

                                angular.forEach(elements, function (item, index) {
                                    if (item.data.rank != 0) {
                                        item.data.rank = parseInt(dcn.degree('#' + item.data.id) * 10000);
                                        if (maxPr < item.data.rank) {
                                            maxPr = item.data.rank;
                                            maxNode = item
                                        }
                                    }
                                });
                            }

                            function closenessCentrality() {
                                var ccn = cy.$().ccn();
                                var maxNode;
                                /*cy.nodes().forEach(function (item){
                                 console.log(ccn.closeness('#'+ item.data('id')));
                                 });*/
                                angular.forEach(elements, function (item, index) {
                                    if (item.data.rank != 0) {
                                        item.data.rank = parseInt(ccn.closeness('#' + item.data.id) * 10000);
                                        if (maxPr < item.data.rank) {
                                            maxPr = item.data.rank;
                                            maxNode = item
                                        }
                                    }
                                })
                            }

                            function betweennessCentrality() {
                                var bc = cy.$().bc();
                                var maxNode;
                                /* cy.nodes().forEach(function(item){
                                 console.log(bc.betweenness('#' + item.data('id')));

                                 });*/
                                angular.forEach(elements, function (item, index) {
                                    if (item.data.rank != 0) {
                                        item.data.rank = parseInt(bc.betweennessNormalized('#' + item.data.id) * 10000);
                                        if (maxPr < item.data.rank) {
                                            maxPr = item.data.rank;
                                            maxNode = item
                                        }
                                    }
                                });
                            }


                            allNodes = cy.nodes();
                            allEles = cy.elements();
                            allEdges = cy.edges();

                            allNodes.forEach(function (n) {
                                var level = n.data('rank') / maxPr;
                                n.style({
                                    'background-color': colorArr[parseInt(level * 10)],
                                    'width': parseInt(level * 100),
                                    'height': parseInt(level * 100),
                                    'opacity': 1,
                                    'line-color': '#c00',
                                    'curve-style': 'bezier',
                                    'label': "data(attrs.connectTimes)"
                                });

                                if (level > 0.6) {
                                    n.style({
                                        'min-zoomed-font-size': 1,
                                        'font-size': parseInt(level * 100)
                                    });
                                }
                            });
                            allEdges.forEach(function (n) {
                                var level = n.data('weight') / maxWeight;
                                n.style({
                                    'line-color': colorArr[parseInt(level * 10)]
                                });

                            });

                            cy.style(style);
                            cy.layout(cose);

                            setNavigator();

                            cy.on('select unselect', 'node', _.debounce(function (e) {
                                var node = cy.$('node:selected');

                                if (node.nonempty()) {
                                    //showNodeInfo(node);

                                    Promise.resolve().then(function () {
                                        return highlight(node);
                                    });
                                } else {
                                    hideNodeInfo();
                                    clear();
                                }

                            }, 100));
                            cy.on('free', 'node', function (e) {
                                var n = e.cyTarget;
                                var p = n.position();

                                n.data('orgPos', {
                                    x: p.x,
                                    y: p.y
                                });
                            });
                            cy.on('mouseover', 'node', function (e) {
                                var nOre = e.cyTarget;
                                nOre.addClass('hover')
                            });
                            cy.on('tapdragout', 'node', function (e) {
                                // debugger;
                                var nOre = e.cyTarget;
                                nOre.removeClass('hover')
                            });
                            cy.on('mouseover', 'edge', function (e) {
                                //debugger;
                                var nOre = e.cyTarget;
                                nOre.addClass('hover');
                                var cNodes = nOre.connectedNodes();
                                cNodes.forEach(function (n) {
                                    n.addClass('hover')
                                })
                            });
                            cy.on('tapdragout', 'edge', function (e) {
                                // debugger;
                                var nOre = e.cyTarget;
                                var cNodes = nOre.connectedNodes();
                                cNodes.forEach(function (n) {
                                    n.removeClass('hover')
                                });
                                nOre.removeClass('hover')
                            });
                        }

                        function setNavigator() {
                            elem.find(".navigatorBox").html("");
                            var defaults = {
                                container: elem.find(".navigatorBox") // can be a HTML or jQuery element or jQuery
                                , viewLiveFramerate: 10// set false to update graph pan only on drag end; set 0 to do it instantly; set a number (frames per second) to update not more than N times per second
                                , thumbnailEventFramerate: 2 // max thumbnail's updates per second triggered
                                , thumbnailLiveFramerate: false // max thumbnail's updates per second. Set false to disable
                                , dblClickDelay: 2 // milliseconds
                                , removeCustomContainer: true // destroy the container specified by user on plugin destroy
                                , rerenderDelay: 2 // ms to throttle rerender updates to the panzoom for performance
                            };
                            cy.navigator(defaults);
                        }

                        function setInitPosition() {
                            allNodes.forEach(function (n) {
                                var p = n.data('orgPos');
                                if (!p) {
                                    var curPosition = cy.$('#' + n.data('id')).position();
                                    n.data('orgPos', {x: curPosition.x, y: curPosition.y});
                                    // console.log(n.data('id') + "\t" + n.data('email') + "\t{" + curPosition.x + ":" + curPosition.y + "}")

                                }
                            });
                        }

                        function getSize(rank) {
                            if (!maxPr) return rank;
                            var size = (rank / maxPr) * maxSize;
                            if (size < minSize)
                                size = minSize;
                            return size
                        }

                        function showNodeInfo(node) {
                            $('#info').html(infoTemplate(node.data())).show();
                        }

                        function hideNodeInfo() {
                            $('#info').hide();
                        }

                        function isDirty() {
                            return lastHighlighted != null;
                        }

                        var restoreElesPositions = function (nhood) {
                            return Promise.all(nhood.map(function (ele) {
                                var p = ele.data('orgPos');
                                return ele.animation({
                                    position: {x: p.x, y: p.y},
                                    duration: aniDur,
                                    easing: easing
                                }).play().promise();
                            }));
                        };

                        function clear(opts) {
                            if (!isDirty()) {
                                return Promise.resolve();
                            }

                            opts = $.extend({}, opts);

                            cy.stop();
                            allNodes.stop();

                            var nhood = lastHighlighted;
                            var others = lastUnhighlighted;

                            lastHighlighted = lastUnhighlighted = null;

                            var hideOthers = function () {
                                return Promise.delay(125).then(function () {
                                    others.addClass('hidden');

                                    return Promise.delay(125);
                                });
                            };

                            var showOthers = function () {
                                cy.batch(function () {
                                    allEles.removeClass('hidden').removeClass('faded');
                                });

                                return Promise.delay(aniDur);
                            };

                            var restorePositions = function () {
                                debugger;
                                cy.batch(function () {
                                    others.nodes().forEach(function (n) {
                                        var p = n.data('orgPos');
                                        n.position({x: p.x, y: p.y});
                                    });
                                });

                                return restoreElesPositions(nhood.nodes());
                            };

                            var resetHighlight = function () {
                                nhood.removeClass('highlighted');
                            };

                            return Promise.resolve()
                                .then(resetHighlight)
                                .then(hideOthers)
                                .then(restorePositions)
                                .then(showOthers)
                                ;
                        }


                        function highlight(node) {
                            var oldNhood = lastHighlighted;

                            var nhood = lastHighlighted = node.closedNeighborhood();
                            var others = lastUnhighlighted = cy.elements().not(nhood);

                            var reset = function () {
                                cy.batch(function () {
                                    others.addClass('hidden');
                                    nhood.removeClass('hidden');

                                    allEles.removeClass('faded highlighted');

                                    nhood.addClass('highlighted');


                                    others.nodes().forEach(function (n) {
                                        var p = n.data('orgPos');
                                        n.position({x: p.x, y: p.y});

                                    });
                                });

                                return Promise.resolve().then(function () {
                                    if (isDirty()) {
                                        return fit();
                                    } else {
                                        return Promise.resolve();
                                    }
                                }).then(function () {
                                    return Promise.delay(aniDur);
                                });
                            };

                            var runLayout = function () {
                                var p = node.data('orgPos');

                                var l = nhood.filter(':visible').makeLayout({
                                    name: 'concentric',
                                    fit: false,
                                    animate: true,
                                    animationDuration: aniDur,
                                    animationEasing: easing,
                                    boundingBox: {
                                        x1: p.x - 1,
                                        x2: p.x + 1,
                                        y1: p.y - 1,
                                        y2: p.y + 1
                                    },
                                    avoidOverlap: true,
                                    concentric: function (ele) {
                                        if (ele.same(node)) {
                                            return 2;
                                        } else {
                                            return 1;
                                        }
                                    },
                                    levelWidth: function () {
                                        return 1;
                                    },
                                    padding: 30
                                });

                                var promise = cy.promiseOn('layoutstop');

                                l.run();

                                return promise;
                            };

                            var fit = function () {
                                return cy.animation({
                                    fit: {
                                        eles: nhood.filter(':visible'),
                                        padding: 30
                                    },
                                    easing: easing,
                                    duration: 500
                                }).play().promise();
                            };

                            var showOthersFaded = function () {
                                return Promise.delay(250).then(function () {
                                    cy.batch(function () {
                                        others.removeClass('hidden').addClass('faded');
                                    });
                                });
                            };

                            return Promise.resolve()
                                .then(reset)
                                .then(runLayout)
                                .then(fit)
                                .then(showOthersFaded)
                                ;

                        }
                    }
                }
            }
        };
    }]);