"use strict";
(function() {
    var factories = angular.module('fairyTree.factories');

    factories.factory('$u', function() {
        return {
            findById: function(array, name) {
                return array.filter(function(current) {
                    return (current.Name == name);
                })[0];
            },
            buildEdges: function(courses) {
                var edges = [];

                courses.forEach(function(current, i) {
                    var connections = [],
                        dependancies = current.depends || [];

                    var helpingCourses = courses.filter(function(course, j) {
                        if (i === j || !course.provides) {
                            return false;
                        }

                        var helpsWith = [];
                        dependancies.forEach(function(term) {
                            if (course.provides.indexOf(term) > -1) {
                                helpsWith.push(term);
                                return true;
                            }
                            return false;
                        });

                        if (helpsWith.length > 0) {
                            connections.push(helpsWith);
                            return true;
                        }

                        return false;
                    })

                    helpingCourses.forEach(function(dependency, i) {
                        edges.push({
                            from: dependency,
                            to: current,
                            connections: connections[i]
                        });
                    });
                });

                return edges;
            }
        };
    });

    factories.factory('$cache', function() {
        var cacheFactory = {
            get: function(key) {
                if (this.cache[key]) {
                    return angular.copy(this.cache[key]);
                }

                if (localStorage) {
                    var jsonString = localStorage[key];

                    if (jsonString) {
                        try {
                            return JSON.parse(jsonString);
                        } catch(e) {}
                    }
                }
            },
            set: function(key, value) {
                this.cache[key] = angular.copy(value);

                if (localStorage) {
                    try {
                        localStorage[key] = JSON.stringify(value);
                    } catch(e) {}
                }

                return this;
            },
            purge: function() {
                this.cache = {};

                if (localStorage) {
                    localStorage.clear();
                }
            }
        };

        cacheFactory.cache = {};

        return cacheFactory;
    });

    factories.factory('$data', function($firebase, $q, $u, $cache) {
        var asPromise = function(value) {
            var deferred = $q.defer();

            setTimeout(function() { deferred.resolve(value) }, 0);

            return deferred.promise;
        };

        var fetchData = function(key) {
            var data = $cache.get(key)
            if (data) { return asPromise(data); }

            var ref = firebase.database().ref(key + '/Result');
            var value = ref.once('value');
            // TODO: Adding to the cache currently produces stack overflow.
            // value.then(function(data) {  
            //     $cache.set(key, data);  
            // });
            return value;
        };

        return {
            checkCache: function() {
                var now = new Date().getTime();
                var lastUpdate = $cache.get('updatedAt') || 0;

                if (now > lastUpdate + 24*60*60*1000) {
                    $cache.purge();
                    $cache.set('updatedAt', now);
                }
            },
            loadMajors: function() {
                return fetchData('Major');
            },
            // TODO: The bevaiour of findById has changed
            // and this function needs rewriting.
            // findMajor: function(id) {
            //     var deferred = $q.defer();

            //     this.loadMajors().then(function(majors) {
            //         deferred.resolve(
            //             $u.findById(majors, id)
            //         )
            //     });

            //     return deferred.promise;
            // },
            loadSubjects: function() {
                return fetchData('Subject');
            },
            loadCourses: function() {
                return fetchData('Alias');
            },
            loadCoursesFor: function(query) {
                var deferred = $q.defer();

                this.loadCourses().then(function(courses) {
                    let syncedCourses = courses.val();
                    deferred.resolve(
                        syncedCourses.filter(function(course) {
                            return (course.Major == query.majorName);
                        })
                    );
                });

                return deferred.promise;
            }
        };
    });
}());
