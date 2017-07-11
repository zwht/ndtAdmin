/**
 * Created by zhaowei on 16/11/14.
 */
var md = require("../module/app");
md.factory("cytoscapeChart", ['$stage','$rootScope', function ($stage,$rootScope) {
    var cytoscapeChart = {};
    cytoscapeChart.init = function (op, otherBox, target) {
        cytoscapeChart.data = {op: op, otherBox: otherBox};
        otherBox.html("");
        var elements = [];
        g;

        var style = [
            {
                selector: 'node',
                style: {
                    'background-color': '#30c9bc',
                    // "content": "data(id)",
                    'background-clip': 'none',
                    'min-zoomed-font-size': 10,
                    label: "data(email)",
                    'font-size': 1,
                    'text-max-width': 5,
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
                    'font-size': 10,
                    'text-max-width': 1

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
                    'width': 5,
                    //'opacity': 0.5,
                    'line-color': '#a8eae5',
                    'curve-style': 'bezier'
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
                     opacity: 0.25,
                    'background-color': 'red',
                    'text-opacity': 0,
                     width:20,
                     height:20
                }
            }
        ];
        var emailToIdx = {};


        angular.forEach(op.nodes, function (item, index) {

            var json = {
                // group: "nodes",
                data: {
                    id: index,
                    email: item.id,
                    /*id: "g" + item.name + ":n" + item.id,*/
                    //oldId: "n" + item.id,
                    //parent:"g" + item.groupId,
                    //groupId: "g" + item.groupId,
                    rank: 10
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
                    rank: 0
                }
            };
            elements.push(json);

        });

        var options = {
            name: 'concentric',

            // Called on `layoutready`
            ready: function () {
            },

            // Called on `layoutstop`
            stop: function () {
            },

            // Whether to animate while running the layout
            animate: true,

            // The layout animates only after this many milliseconds
            // (prevents flashing on fast runs)
            animationThreshold: 250,

            // Number of iterations between consecutive screen positions update
            // (0 -> only updated on the end)
            refresh: 20,

            // Whether to fit the network view after when done
            fit: true,

            // Padding on fit
            padding: 20,

            // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
            // boundingBox: {x1:100,y1:100,x2:2000,y2:800},

            // Randomize the initial positions of the nodes (true) or use existing positions (false)
            randomize: false,

            // Extra spacing between components in non-compound graphs
            componentSpacing: 100,

            // Node repulsion (non overlapping) multiplier
            nodeRepulsion: function (node) {
                return 400000;
            },

            // Node repulsion (overlapping) multiplier
            nodeOverlap: 10,

            // Ideal edge (non nested) length
            idealEdgeLength: function (edge) {
                return 10;
            },

            // Divisor to compute edge forces
            edgeElasticity: function (edge) {
                return 100;
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


        var cy = window.cy = cytoscape({
            container: document.getElementById('cy'),
            pixelRatio: 1,
            container: otherBox,
            hideEdgesOnViewport: true,
            textureOnViewport: true,
            motionBlur: true,
            motionBlurOpacity: true,
            layout: options,

            ready: function () {
                // cy.toolbar({
                //     toolbarClass: "cy-toolbar",
                //     tools: [
                //         [
                //             {
                //                 icon: 'fa fa-link',
                //                 event: ['tap'],
                //                 selector: 'node',
                //                 bubbleToCore: false,
                //                 tooltip: 'Link',
                //                 action: [hide]
                //             }
                //         ]
                //     ],
                //     appendTools: true
                // });
            },
            // removed for brevity
            elements: elements,
            style: style
        });
        var t1 = new Date().getTime();
        var pr = cy.elements().pageRank();

        angular.forEach(elements, function (item, index) {
            if (item.data.rank != 0) {
                item.data.rank = parseInt(pr.rank('#' + item.data.id) * 100);
                if (maxPr < item.data.rank)
                    maxPr = item.data.rank
            }
            // console.log("PPPPPPPPPPP"+ item.data.rank);
        });
        var t2 = new Date().getTime();
        console.log(t1);
        console.log(t2);
        console.log(t2 - t1);
        /* cy.remove(cy.elements());
         cy.add(elements);*/
        // cy.resize();
        //  console.log('g rank: ' + pr.rank('#1'));

        cy.navigator({
            // options...
        });

        //离开邮件分析页面时,remove
        $rootScope.$on('$stateChangeStart', function(){
            $('.cytoscape-navigator').remove();
            $('.ui-cytoscape-toolbar').remove();
        });

        
        cy.viewUtilities({
        });
        var ur = cy.undoRedo();

        function hide() {
            ur.do("hide", cy.$(":selected"));
        }

        /*  $("#hide").click(function () {
            ur.do("hide", cy.$(":selected"));
         });*/

        $("#showAll").click(function () {
            ur.do("show", cy.elements());
        });

        $("#highlightNeighbors").click(function () {
            if(cy.$(":selected").length > 0)
                ur.do("highlightNeighbors", cy.$(":selected"));
        });

        $("#removeHighlights").click(function () {
            ur.do("removeHighlights");
        });

        var start, end;
        bindRouters();
        if (target != null || target != "") {
            var emailName = '[email = ' + "\"" + target + "\"" + ']';
            console.log(emailName);
            var node = cy.nodes().filter(emailName);
            var neighborhood = node.neighborhood().add(node);
            //cy.elements().addClass('faded');
            neighborhood.addClass('faded');
            node.animate({
                   style: {
                       'background-color': 'red',
                       'height': 50,
                       'width': 50,
                       label: "data(email)",
                       'font-size': 1,
                       'text-max-width': 5
                   }
               });
        }


        function bindRouters() {
            var newNode = "";
            var tmp = $("<div class='startEndTmp'><i></i></div>");
            var startDoc = $("<span>start</span>");
            var endDoc = $("<span>end</span>");
            tmp.append(startDoc);
            tmp.append(endDoc);
            otherBox.append(tmp);
            startDoc.click(function (event) {
                event.stopPropagation();
                start = newNode;
                tmp.hide();
            });
            endDoc.click(function () {
                event.stopPropagation();
                end = newNode;
                tmp.hide();
                cy.startBatch();

                var aStar = cy.elements().aStar({
                    root: start,
                    goal: end,
                    weight: function (e) {
                        if (e.data('is_walking')) {
                            return 0.25; // assume very little time to walk inside stn
                        }

                        return e.data('is_bullet') ? 1 : 3; // assume bullet is ~3x faster
                    }
                });
                if (!aStar.found) {
                    $stage.warningor("没连接!");
                    clear();
                    cy.endBatch();
                    return;
                }

                cy.elements().not(aStar.path).addClass('not-path');
                aStar.path.addClass('path');
                cy.endBatch();
            });

            var nodes = cy.nodes();

            nodes.on('click', function (evt) {
                newNode = evt.cyTarget;
                tmp.css({top: evt.cyRenderedPosition.y + 15, left: evt.cyRenderedPosition.x - 45});
                tmp.show();
                if (end) {
                    clear();
                    end = "";
                    start = "";
                }
                if (!start) {
                    clear();
                    startDoc.show();
                    endDoc.hide();
                } else {
                    endDoc.show();
                    startDoc.hide();
                }
                newNode.addClass("hover");
            });
            cy.on("click", function (evn) {
                if (evn.cyTarget._private.group == "nodes") return;
                setTimeout(function () {
                    if (start || end) {
                    } else {
                        clear();
                    }
                }, 100);
                tmp.hide();
            });

        }

        function clear() {
            cy.elements().removeClass('path not-path start end hover');
        }

        function getSize(rank) {
            var size = (rank / maxPr) * maxSize;
            if (size < minSize)
                size = minSize;
            return size
        }
    };


    return cytoscapeChart;

}]);
