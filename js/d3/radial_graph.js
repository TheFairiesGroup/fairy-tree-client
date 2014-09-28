(function() {
    angular.module('fairyTree.directives', ['d3']).directive('radialGraph', ['$window', '$timeout', 'd3Service',
        function($window, $timeout, d3Service) {
            return {
                restrict: 'A',
                scope: {
                    subjects: '='
                },
                link: function($scope, element, attrs) {
                    d3Service.d3().then(function(d3) {
                        $scope.subjects.$loaded(function(subjects) {
                            if (!subjects.length) { return; }

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

                            // Define the gradient
                            var gradient = svg.append("svg:defs")
                                .append("svg:linearGradient")
                                .attr("id", "gradient")
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "100%")
                                .attr("y2", "100%")
                                .attr("spreadMethod", "pad");

                            // Define the gradient colors
                            gradient.append("svg:stop")
                                .attr("offset", "0%")
                                .attr("stop-color", "#74C365")
                                .attr("stop-opacity", 1);

                            gradient.append("svg:stop")
                                .attr("offset", "100%")
                                .attr("stop-color", "#E62020")
                                .attr("stop-opacity", 1);

                            var findNodes = function(subjects) {
                                return subjects.map(function(subject) {
                                    return {
                                        name: subject._name,
                                        parent: 'root',
                                        id: subject.$id,
                                        subject: subject
                                    };
                                });
                            };

                            var nodes = cluster.nodes({name: 'root', children: findNodes(subjects)});
                            var links = subjects.buildEdges().map(function(edge) {
                                var source, target;

                                for (var i = 0; i < nodes.length; i++) {
                                    if (edge.from.$id == nodes[i].id) {
                                        source = nodes[i];
                                    }
                                    if (edge.to.$id == nodes[i].id) {
                                        target = nodes[i];
                                    }

                                    if (source && target) { break; }
                                };

                                if (!(source && target)) { debugger; }

                                return {
                                    source: source,
                                    target: target,
                                };
                            });

                            svg.selectAll(".link")
                                .data(bundle(links))
                                .enter().append("path")
                                .attr("class", "link")
                                .attr("d", line)
                                .attr("stroke", 'url(#gradient)');

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
                                })
                                .on('mouseover', function(d) {
                                    svg.selectAll(".link")
                                        .filter(function(data) { return (data[0].id != d.id && data[2].id != d.id) })
                                        .attr('stroke-opacity', 0.1);
                                })
                                .on('mouseout', function() { svg.selectAll('.link').attr('stroke-opacity', 1) });

                            d3.select(self.frameElement).style("height", diameter + "px");
                        });
                    });
                }
            }
        }
    ])
}());
