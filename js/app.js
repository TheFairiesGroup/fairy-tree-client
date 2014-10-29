"use strict";

(function() {
    angular.module('fairyTree').config(["$routeProvider",

        function($routeProvider) {
            $routeProvider
                .when("/home", {
                    templateUrl: "partials/slides.html",
                    controller: "MajorsController",
                })
                .when("/major/:majorId", {
                    templateUrl: "partials/slides.html",
                    controller: "MajorsController",
                })
                .otherwise({
                    redirectTo: "/home"
                });
        }

    ]);
})();
