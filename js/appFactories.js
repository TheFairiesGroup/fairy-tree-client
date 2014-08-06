"use strict";
(function () {
  var appFactories = angular.module("appFactories", ["firebase"]);

  appFactories.factory("graphFactory", function ($FirebaseArray) {
    return $FirebaseArray.$extendFactory({
      exportGraph: function () {
        var subj = this.$list,
          edges = [];

        subj.forEach(function (subjectA, i) {
          var connections = [],
            dependentTerms = subjectA.Depends || [];

          var dependencies = subj.filter(function (subjectB, j) {
            if (i === j) return false;

            if (!Array.isArray(subjectB.Provides)) {
              subjectB.Provides = [];
            }

            var commonTerms = [];
            dependentTerms.forEach(function (term) {
              if (subjectB.Provides.indexOf(term) > -1) {
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