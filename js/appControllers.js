(function () {
  var appControllers = angular.module("appControllers", ["firebase", "appFactories"]);

  appControllers.controller('MajorsController', function MajorsController($scope, $firebase) {
    var refMajors = new Firebase("https://fairytree.firebaseio.com/Majors");
    $scope.majors = $firebase(refMajors).$asArray();

  });

  appControllers.controller('SubjectsController', ["$scope", "$firebase", "$routeParams", "graphFactory",
    function SubjectsController($scope, $firebase, $routeParams, graphFactory) {
      var refSubjects = new Firebase("https://fairytree.firebaseio.com/Subjects");
      $scope.subjects = $firebase(refSubjects, {
        arrayFactory: graphFactory
      }).$asArray();
      $scope.subjects.$loaded().then(function () {
        $scope.edges = $scope.subjects.exportGraph();
        // console.log($scope.edges);
      });

      var refMajors = new Firebase("https://fairytree.firebaseio.com/Majors");
      $scope.selectedMajor = " ";
      $scope.majors = $firebase(refMajors).$asArray();
      $scope.majors.$loaded().then(function () {
        $scope.selectedMajor = $scope.majors.filter(function (major) {
          return major.$id === $routeParams.majorId;
        })[0];
      });

      $scope.select = function (subject) {
        // console.log(subject);
        $scope.selected = subject;
      };
    }
  ]);

}());