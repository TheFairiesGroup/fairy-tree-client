(function() {
    var controllers = angular.module("fairyTree.controllers", ["firebase", "fairyTree.factories"]);

    controllers.controller('MajorsController', function MajorsController($scope, $firebase) {
        var refMajors = new Firebase("https://fairybase.firebaseio.com/Major");
        $scope.majors = $firebase(refMajors).$asArray();
    });

    controllers.controller('SubjectsController', ["$scope", "$firebase", "$routeParams", "graphFactory",
        function SubjectsController($scope, $firebase, $routeParams, graphFactory) {
            var refSubjects = new Firebase("https://fairybase.firebaseio.com/Subject");

            $scope.subjects = $firebase(refSubjects, {
                arrayFactory: graphFactory
            }).$asArray();

            var refMajors = new Firebase("https://fairybase.firebaseio.com/Major");

            $scope.currentMajor = " ";
            $scope.majors = $firebase(refMajors).$asArray();
            $scope.majors.$loaded().then(function() {
                $scope.currentMajor = $scope.majors.filter(function(major) {
                    return major.$id === $routeParams.majorId;
                })[0];
            });

            $scope.select = function(subject) {
                $scope.selected = subject;
            };
        }
    ]);
}());
