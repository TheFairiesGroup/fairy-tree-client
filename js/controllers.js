(function() {
    var controllers = angular.module("controllers", ["firebase", "factories"]);

    controllers.controller('MajorsController', function MajorsController($scope, $firebase) {
        var refMajors = new Firebase("https://fairytree.firebaseio.com/Majors");
        $scope.majors = $firebase(refMajors).$asArray();
    });

    controllers.controller('SubjectsController', ["$scope", "$firebase", "$routeParams", "graphFactory",
        function SubjectsController($scope, $firebase, $routeParams, graphFactory) {
            var refSubjects = new Firebase("https://fairytree.firebaseio.com/Subjects");

            $scope.subjects = $firebase(refSubjects, {
                arrayFactory: graphFactory
            }).$asArray();

            $scope.subjects.$loaded().then(function() {
                $scope.edges = $scope.subjects.exportGraph();
            });

            var refMajors = new Firebase("https://fairytree.firebaseio.com/Majors");

            $scope.selectedMajor = " ";
            $scope.majors = $firebase(refMajors).$asArray();
            $scope.majors.$loaded().then(function() {
                $scope.selectedMajor = $scope.majors.filter(function(major) {
                    return major.$id === $routeParams.majorId;
                })[0];
            });

            $scope.select = function(subject) {
                $scope.selected = subject;
            };

            console.log($scope);

            $scope.greeting = "Resize the page to see the re-rendering";
            $scope.data = [
                {name: "Greg", score: 98},
                {name: "Ari", score: 96},
                {name: 'Q', score: 75},
                {name: "Loser", score: 48}
            ];
        }
    ]);
}());
