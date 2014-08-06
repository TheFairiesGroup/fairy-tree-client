"use strict";
(function () {
  var appFactories = angular.module("appFactories", ["firebase"]);

  appFactories.factory("graphFactory", function ($FirebaseArray) {
    return $FirebaseArray.$extendFactory({
      exportGraph: function () {
        var subj = this.$list,
          edges = [];

        subj.forEach(function (subjectA, i) {
          var connections = [];
          var dependencies = subj.filter(function (subjectB, j) {
            if (i === j) return false;
            // TODO: write some real logic here
            connections.push([]);
            return true;
          })

          dependencies.forEach(function (dependency, i) {
            edges.push({
              from: dependency,
              to: subjectA,
              connections: connections[i]
            });
          });
        });

        return edges;
      }
    });
  })
}());