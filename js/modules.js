"use strict";

(function() {
    angular.module('fairyTree.factories', []);
    angular.module('fairyTree.controllers', ['firebase', 'fairyTree.factories']);
    angular.module('fairyTree.directives', ['d3', 'fairyTree.factories']);
    angular.module("fairyTree", ["ngRoute", "fairyTree.controllers", "fairyTree.directives"]);
})();
