"use strict";

(function () {
  var app = angular.module("fairyTree", ["ngRoute", "appControllers"]);

  // won't be using it
  // app.directive("major", function() {
  //   return {
  //     restrict: "E",
  //     templateUrl: "directives/major.html"
  //   };
  // });

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
      .otherwise({
        redirectTo: "/home"
      });
  }]);
})();