(function() {
    angular.module('fairyTree.directives').directive('radialRttree', ['$window', '$timeout', 'd3Service', '$u',
        function($window, $timeout, d3Service, $u) {
            return {
                restrict: 'A',
                scope: {
                    courses: '=',
                    major: '='
                },
                link: function($scope, element, attrs) {
                    d3Service.d3().then(function(d3) {
                        $scope.$watch('courses', function(courses) {
                            if (!courses || !courses.length) { return; }

                        var diameter = 960;

                        var tree = d3.layout.tree()
                            .size([360, diameter / 2 - 120])
                            .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

                        var diagonal = d3.svg.diagonal.radial()
                                        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

                        var svg = d3.select(element[0]).append("svg")
                            .attr("width", diameter)
                            .attr("height", diameter - 150)
                          .append("g")
                            .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

                            var findNodes = function(courses) {
                                return courses.map(function(current) {
                                    return {
                                        name: current.display_name,
                                        parent: 'root',
                                        id: current.$id,
                                        course: current
                                    };
                                });
                            };

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

                            var nodes = tree.nodes({name: $scope.major.display_name, children: findNodes(courses)});
                            var links = $u.buildEdges(courses).map(function(edge) {
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

                            var link = svg.selectAll(".link")
                              .data(links)
                            .enter().append("path")
                              .attr("class", "link")
                              .attr("d", diagonal)
                              .attr("stroke", 'url(#gradient)');

                            var node = svg.selectAll(".node")
                              .data(nodes)
                            .enter().append("g")
                              .attr("class", "node")
                              .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

                            node.append("circle")
                              .attr("r", 4.5)
                              .attr("fill", function(d) { return d.size ? "#00" + (d.size + 10050).toString(16) : "red"; });

                            node.append("text")
                              .attr("dy", ".31em")
                              .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                              .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
                              .text(function(d) { return d.name; });

                            node.on('mouseover', function(d) {
                                svg.selectAll(".link")
                                    .filter(function(data) { return (data.source.id != d.id && data.target.id != d.id) })
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
