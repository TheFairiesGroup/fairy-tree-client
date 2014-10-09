(function() {
    var controllers = angular.module('fairyTree.controllers', ['firebase', 'fairyTree.factories']);

    controllers.controller('MajorsController', function MajorsController($scope, $data) {
        $scope.majors = $data.majors();
    });

    controllers.controller('SubjectsController', ['$scope', '$firebase', '$routeParams', '$data', '$u',
        function SubjectsController($scope, $firebase, $routeParams, $data, $u) {
            $scope.majors = $data.majors();

            $data.findMajor($routeParams.majorId).then(function(value) {
                $scope.currentMajor = value;
            });

            var subjects = $data.subjects();

            $data.coursesFor({majorId: $routeParams.majorId}).then(function(courses) {
                subjects.$loaded().then(function() {
                    courses.forEach(function(course) {
                        course.subject = $u.findById(subjects, course.subject_id);

                        /* e.g. course.provides === course.subject.provides */
                        ['provides', 'depends', 'description'].forEach(function(property) {
                            Object.defineProperty(course, property, {get: function() { return this.subject[property]; }});
                        });
                    });

                    $scope.courses = courses;
                });
            });

        }
    ]);
}());
