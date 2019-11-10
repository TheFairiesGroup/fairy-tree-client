(function() {
    var controllers = angular.module('fairyTree.controllers', ["firebase"]);

    controllers.controller('MajorsController', function MajorsController($scope, $data, $u, $routeParams) {
        $data.checkCache();

        $data.loadMajors().then(function(majors) {
            $scope.$apply(function() {
                $scope.majors = majors.val();
                $scope.majors.forEach((major) => { major.active = true; });
                $scope.view = 'rttree';

                $scope.selectMajor = function(majorName) {
                    $('#slide-graph').show(); /* XXX: this is a hack */

                    $scope.view = ($scope.view == 'rttree' ? 'heb' : 'rttree');  /* Hack to ensure reloading directives and deselect of subject*/
                    $scope.currentMajor = $u.findById($scope.majors, majorName);

                    $data.loadCoursesFor({majorName: majorName}).then(function(courses) {
                        $data.loadSubjects().then(function(subjects) {
                            let syncedSubjects = subjects.val();
                            courses.forEach(function(course) {
                                course.subject = $u.findById(syncedSubjects, course.Subject);

                                /* e.g. course.provides === course.subject.provides */
                                ['Provides', 'Depends', 'Description'].forEach(function(property) {
                                    Object.defineProperty(course, property, {get: function() { return this.subject[property]; }});
                                });
                            });

                            $scope.$apply(function() {
                                $scope.courses = courses;
                            });
                        });
                    });
                };
            });

            if ($routeParams.majorId) {
                $scope.selectMajor($routeParams.majorId);
            }
        });
    });
}());
