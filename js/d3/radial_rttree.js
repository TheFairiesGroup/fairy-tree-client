(function() {
    angular.module('fairyTree.directives').directive('radialRttree', ['$window', '$timeout', 'd3Service', '$u',
        function($window, $timeout, d3Service, $u) {
            return {
                restrict: 'A',
                scope: {
                    courses: '=',
                    major: '=',
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

                            var diameter = currentDiameter();

                            var tree = d3.layout.tree()
                                .size([360, diameter / 2 - 120])
                                .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

                            var diagonal = d3.svg.diagonal.radial().projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

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
;

                            var svg = chart.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

                            var buildChildren = function(root, courses, level) {
                                //if(level > 2) return [];
                                return _.chain(courses).map(function(current) {
                                    if (root.Id == current.Id) { return undefined; }

                                    var links = _.intersection(root.provides, current.depends);

                                    if(!links.length) return undefined;

                                    return {
                                        name: current.Name,
                                        id: current.Id,
                                        course: current,
                                        children: buildChildren(current, _.without(courses, root), level + 1),
                                        links: links
                                    };
                                }).compact().value();
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

                            // TODO: function to calculate all "initial nodes"
                            // and build trees from all of them
                            var root = {
                                Id: 'rootId',
                                _name: 'root_name',
                                Name: $scope.major.Name,
                                depends: [],
                                provides: ['root_link'],
                                subject: {
                                    Id: 'root_subject',
                                    _name: 'root_subj_name'
                                }
                            };

                            courses = courses.map(function(c) {
                                if(!c.subject.depends || c.subject.depends.length == 0)
                                    c.subject.depends = ['root_link'];
                                return c;
                            });

                            var children1st = buildChildren(root, courses, 0);

                            var nodes = tree.nodes({name: root.Name, children: children1st});
                            var links = tree.links(nodes)

                            var link = svg.selectAll(".link")
                                .data(links).enter()
                                .append("path")
                                    .attr("class", "link")
                                    .attr("d", diagonal)
                                    .attr("stroke", 'url(#gradient)')
                                .append("title")
                                    .text(function(d) {
                                        if(d.target.links.length == 1 && d.target.links[0] == 'root_link') return '';
                                        return d.target.links.join(', ');
                                    });

                            var node = svg.selectAll(".node")
                                .data(nodes).enter()
                                .append("g")
                                    .attr("class", "node")
                                    .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

                            node.append("circle")
                                    .attr("r", 4.5)
                                    .attr("fill", function(d) { return d.size ? "#00" + (d.size + 10050).toString(16) : "red"; });

                            node.append("text")
                                    .attr("dy", ".31em")
                                    .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                                    .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
                                    .text(function(d) { return d.name; })
                                .append("title")
                                    .text(function(d) {
                                        if (d.course) {
                                            return (d.course.Description || '').split(' ').slice(0, 14).join(' ') + '...';
                                        }
                                    });

                            node.on('click', function(d) {
                                d3.event.stopPropagation();
                                $scope.selected = d.course;
                                $scope.$apply();
                            }).on('mouseover', function(d) {
                                svg.selectAll(".link")
                                    .filter(function(data) { return (data.source.id != d.id && data.target.id != d.id) })
                                    .attr('stroke-opacity', 0.1);
                            }).on('mouseout', function() {
                                svg.selectAll('.link').attr('stroke-opacity', 1)
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
