(function() {
    var controllers = angular.module('fairyTree.controllers');

    controllers.controller('MajorsController', function MajorsController($scope, $data, $u, $routeParams) {
        $data.checkCache();

        $data.loadMajors().then(function(majors) {
            $scope.majors = majors;
            $scope.view = 'rttree';

            $scope.selectMajor = function(majorId) {
                $('#slide-graph').show(); /* XXX: this is a hack */

                $scope.view = ($scope.view == 'rttree' ? 'heb' : 'rttree');  /* Hack to ensure reloading directives and deselect of subject*/
                $scope.currentMajor = $u.findById($scope.majors, majorId);

                $data.loadCoursesFor({majorId: majorId}).then(function(courses) {
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
            };

            if ($routeParams.majorId) {
                $scope.selectMajor($routeParams.majorId);
            }
        });
    });
}());
