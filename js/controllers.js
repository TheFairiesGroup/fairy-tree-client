(function() {
    var controllers = angular.module('fairyTree.controllers');

    controllers.controller('CacheController', function CacheController($cache, $location) {
        $cache.purge();

        $location.path('/home');
    });

    controllers.controller('MajorsController', function MajorsController($scope, $data) {
        $data.loadMajors().then(function(majors) {
            $scope.majors = majors;
        });
    });

    controllers.controller('SubjectsController', ['$scope', '$firebase', '$routeParams', '$data', '$u',
        function SubjectsController($scope, $firebase, $routeParams, $data, $u) {
            $data.loadMajors().then(function(majors) {
                $scope.majors = majors;
            });

            $data.findMajor($routeParams.majorId).then(function(value) {
                $scope.currentMajor = value;
            });

            $data.loadCoursesFor({majorId: $routeParams.majorId}).then(function(courses) {
                $data.loadSubjects().then(function(subjects) {
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
