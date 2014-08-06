"use strict";

(function () {
  var app = angular.module("fairyTree", ["ngRoute", "appControllers"]);

  app.config(["$routeProvider",
    function ($routeProvider) {
      $routeProvider
        .when("/home", {
          templateUrl: "partials/majors.html",
          controller: "MajorsController"
        })
        .when("/major/:majorId", {
          templateUrl: "partials/subjects.html",
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