(function() {
    angular.module('fairyTree.directives').directive('radialGraph', ['d3Service', '$u',
        function(d3Service, $u) {
            return {
                restrict: 'A',
                scope: {
                    courses: '=',
                    selected: '='
                },
                link: function($scope, element, attrs) {
                    var currentDiameter = function() {
                        var d = window.innerHeight;

                        if (d < 900) {
                            return 900;
                        }

                        return d;
                    };

                    d3Service.d3().then(function(d3) {
                        $scope.$watch('courses', function(courses) {
                            if (!courses || !courses.length) { return; }

                            var diameter = currentDiameter(),
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

                            d3.select(element[0]).selectAll('svg').remove();

                            var chart = d3.select(element[0])
                                .append("svg")
                                    .attr('viewBox', '0 0 ' + diameter + ' ' + diameter)
                                    .attr('preserveAspectRatio', 'xMidYMid')
                                    .attr('class', 'chart')
                                    .attr('width', diameter)
                                    .attr('height', diameter)
                                    .on('click', function(d) {
                                        $scope.selected = null;
                                        $scope.$apply();
                                    });

                            var svg = chart.append("g").attr("transform", "translate(" + radius + "," + radius + ")");

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

                            var findNodes = function(courses) {
                                return courses.map(function(current) {
                                    return {
                                        name: current.Name,
                                        parent: 'root',
                                        id: current.Id,
                                        course: current,
                                        size: Math.round(Math.random() * 10000)
                                    };
                                });
                            };

                            var nodes = cluster.nodes({name: 'root', children: findNodes(courses)});
                            var links = $u.buildEdges(courses).map(function(edge) {
                                var source, target;

                                for (var i = 0; i < nodes.length; i++) {
                                    if (edge.from.Id == nodes[i].id) {
                                        source = nodes[i];
                                    }
                                    if (edge.to.Id == nodes[i].id) {
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

                            var link = svg.selectAll(".link");

                            link.data(bundle(links)).enter()
                                .append("path")
                                    .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
                                    .attr("class", "link")
                                    .attr("d", line)
                                    .attr("stroke", 'url(#gradient)');

                            var node = svg.selectAll(".node");

                            node.data(nodes.filter(function(n) {
                                    return !n.children;
                                })).enter()
                                .append("g")
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
                                    .on('click', function(d) {
                                        d3.event.stopPropagation();
                                        $scope.selected = d.course;
                                        $scope.$apply();
                                    })
                                    .on('mouseover', function(d) {
                                        svg.selectAll(".link")
                                            .filter(function(l) {
                                                return (l.target.id != d.id && l.source.id != d.id)
                                            })
                                            .attr('stroke-opacity', 0.1);
                                    })
                                    .on('mouseout', function() { svg.selectAll('.link').attr('stroke-opacity', 1) })
                                .append("title")
                                    .text(function(d) {
                                        if (d.course) {
                                            return (d.course.Description || '').split(' ').slice(0, 14).join(' ') + '...';
                                        }
                                    });

                            window.addEventListener('resize', function() {
                                var w = currentDiameter();
                                chart.attr('width', w).attr('height', w);
                            });
                        });
                    });
                }
            }
        }
    ])
}());
