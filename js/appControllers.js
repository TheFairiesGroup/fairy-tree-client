(function () {
  var appControllers = angular.module("appControllers", ["firebase", "appFactories"]);

  appControllers.controller('MajorsController', function MajorsController($scope, $firebase) {
    var refMajors = new Firebase("https://fairytree.firebaseio.com/Majors");
    $scope.majors = $firebase(refMajors).$asArray();

  });

  appControllers.controller('SubjectsController', function SubjectsController($scope, $firebase, $routeParams) {
    var refSubjects = new Firebase("https://fairytree.firebaseio.com/Subjects");
    $scope.subjects = $firebase(refSubjects, {arrayFactory: "SubjectsToGraph"}).$asArray();
    $scope.subjects.$loaded().then(function () {
      $scope.edges = $scope.subjects.exportGraph();
      console.log($scope.edges);
    });

    var refMajors = new Firebase("https://fairytree.firebaseio.com/Majors");
    $scope.majors = $firebase(refMajors).$asArray();

    $scope.select = function (subject) {
      console.log(subject);
      $scope.selected = subject;
    }

    // this.selected = false;

    // this.edges = match(this.array);
  });

}());