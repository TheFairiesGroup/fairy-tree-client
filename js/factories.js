"use strict";
(function() {
    var factories = angular.module('fairyTree.factories', []);

    factories.factory('$u', function() {
        return {
            findById: function(array, id) {
                return array.filter(function(current) {
                    return (current.$id == id);
                })[0];
            },
            buildEdges: function(subjects) {
                var edges = [];

                subjects.forEach(function(subjectA, i) {
                    var connections = [],
                        dependentTerms = subjectA.depends || [];

                    var dependencies = subjects.filter(function(subjectB, j) {
                        if (i === j) return false;

                        if (!Array.isArray(subjectB.provides)) {
                            subjectB.provides = [];
                        }

                        var commonTerms = [];
                        dependentTerms.forEach(function(term) {
                            if (subjectB.provides.indexOf(term) > -1) {
                                commonTerms.push(term);
                                return true;
                            }
                            return false;
                        });

                        if (commonTerms && commonTerms.length > 0) {
                            connections.push(commonTerms);
                            return true;
                        }

                        return false;
                    })

                    dependencies.forEach(function(dependency, i) {
                        edges.push({
                            from: dependency,
                            to: subjectA,
                            connections: connections[i]
                        });
                    });
                });

                return edges;
            }
        };
    });

    factories.factory('$data', function($firebase, $q, $u) {
        return {
            majors: function() {
                var ref = new Firebase("https://fairybase.firebaseio.com/Major");
                return $firebase(ref).$asArray();
            },
            findMajor: function(id) {
                var deferred = $q.defer();

                var majors = this.majors();

                majors.$loaded().then(function() {
                    deferred.resolve(
                        $u.findById(majors, id)
                    )
                });

                return deferred.promise;
            },
            subjects: function() {
                var ref = new Firebase("https://fairybase.firebaseio.com/Subject");
                return $firebase(ref).$asArray();
            },
            courses: function() {
                var ref = new Firebase("https://fairybase.firebaseio.com/Course");
                return $firebase(ref).$asArray();
            },
            coursesFor: function(query) {
                var deferred = $q.defer();

                var courses = this.courses();
                courses.$loaded().then(function() {
                    deferred.resolve(
                        courses.filter(function(course) {
                            return (course.major_id == query.majorId);
                        })
                    );
                });

                return deferred.promise;
            }
        };
    });
}());
