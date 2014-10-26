(function() {
    angular.module('fairyTree.directives').directive('simpleFormat',
        function() {
            return {
                restrict: 'E',
                scope: true,
                templateUrl: 'partials/simple_format.html',
                link: function($scope, element, attrs) {
                    $scope.$watch(attrs.text, function(text) {
                        $scope.paragraphs = [];

                        if (text) {
                            text.replace(/\r\n|\r/g, '\n');

                            paragraphs = text.split('\n\n');
                            $scope.paragraphs = _.map(paragraphs, function(lines) {
                              return lines.split('\n');
                            });
                        }
                    });
                }
            }
        }
    )
}());
