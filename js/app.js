"use strict";

(function() {
    var app = angular.module("fairyTree", ["ngRoute", "fairyTree.controllers", "fairyTree.directives"]);

    app.config(["$routeProvider",
        function($routeProvider) {
            $routeProvider
                .when("/home", {
                    templateUrl: "partials/majors.html",
                    controller: "MajorsController"
                })
                .when("/major/:majorId", {
                    templateUrl: "partials/subjects.html",
                    controller: "SubjectsController"
                })
                .when("/major_rttree/:majorId", {
                    templateUrl: "partials/subjects_rttree.html",
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
