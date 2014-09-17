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

                    });
                }
            }
        }
    ])
}());
