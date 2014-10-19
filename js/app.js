"use strict";

(function() {
    angular.module('fairyTree').config(["$routeProvider",

        function($routeProvider) {
            $routeProvider
                .when('/refresh', {
                    templateUrl: "partials/majors.html",
                    controller: "CacheController"
                })
                .when("/home", {
                    templateUrl: "partials/majors.html",
                    controller: "MajorsController"
                })
                .when("/major/:majorId", {
                    templateUrl: "partials/radial_graph.html",
                    controller: "SubjectsController"
                })
                .when("/major_rttree/:majorId", {
                    templateUrl: "partials/rttree.html",
                    controller: "SubjectsController"
                })
                .when("/about", {
                    templateUrl: "partials/about.html"
                })
                .otherwise({
                    redirectTo: "/home"
                });
        }

    ]);
})();
