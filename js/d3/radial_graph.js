(function() {
    angular.module('fairyTree.directives', ['d3']).directive('radialGraph', ['$window', '$timeout', 'd3Service',
        function($window, $timeout, d3Service) {
            return {
                restrict: 'A',
                scope: {
                    data: '=',
                    label: '@',
                    onClick: '&'
                },
                link: function($scope, element, attrs) {
                    d3Service.d3().then(function(d3) {
                        $scope.$watch('data', function(data) {
                            if (!data) { return; }

                            var diameter = 960,
                                radius = diameter / 2,
                                innerRadius = radius - 120;

                            var cluster = d3.layout.cluster()
                                .size([360, innerRadius])
                                .sort(null)
                                .value(function(d) {
                                    return d.size;
                                });

                            var bundle = d3.layout.bundle();

                            var line = d3.svg.line.radial()
                                .interpolate("bundle")
                                .tension(0.25)
                                .radius(function(d) {
                                    return d.y;
                                })
                                .angle(function(d) {
                                    return d.x / 180 * Math.PI;
                                });

                            var svg = d3.select(element[0]).append("svg")
                                .attr("width", diameter)
                                .attr("height", diameter)
                                .append("g")
                                .attr("transform", "translate(" + radius + "," + radius + ")");

                            var findNodes = function(edges) {
                                var unique = {};
                                var result = [];

                                for (var i = 0; i < edges.length; i++) {
                                    if (!unique[edges[i].from.Name]) {
                                        result.push({name: edges[i].from.Name, parent: 'root'});
                                        unique[edges[i].from.Name] = true;
                                    }

                                    if (!unique[edges[i].to.Name]) {
                                        result.push({name: edges[i].to.Name, parent: 'root'});
                                        unique[edges[i].to.Name] = true;
                                    }
                                }

                                return result;
                            };

                            var nodes = cluster.nodes({name: 'root', children: findNodes(data)});
                            var links = data.map(function(edge) {
                                var source, target;

                                for (var i = 0; i < nodes.length; i++) {
                                    if (edge.from.Name == nodes[i].name) {
                                        source = nodes[i];
                                    }
                                    if (edge.to.Name == nodes[i].name) {
                                        target = nodes[i];
                                    }

                                    if (source && target) { break; }
                                };

                                if (!(source&& target)) { debugger; }

                                return {
                                    source: source,
                                    target: target,
                                };
                            });

                            svg.selectAll(".link")
                                .data(bundle(links))
                                .enter().append("path")
                                .attr("class", "link")
                                .attr("d", line);

                            svg.selectAll(".node")
                                .data(nodes.filter(function(n) {
                                    return !n.children;
                                }))
                                .enter().append("g")
                                .attr("class", "node")
                                .attr("transform", function(d) {
                                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                                })
                                .append("text")
                                .attr("dx", function(d) {
                                    return d.x < 180 ? 8 : -8;
                                })
                                .attr("dy", ".31em")
                                .attr("text-anchor", function(d) {
                                    return d.x < 180 ? "start" : "end";
                                })
                                .attr("transform", function(d) {
                                    return d.x < 180 ? null : "rotate(180)";
                                })
                                .text(function(d) {
                                    return d.name;
                                });

                            d3.select(self.frameElement).style("height", diameter + "px");
                        });
                    });
                }
            }
        }
    ])
}());
