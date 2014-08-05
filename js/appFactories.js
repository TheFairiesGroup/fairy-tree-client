"use strict";
(function () {
  var appFactories = angular.module("appFactories", ["firebase"]);

  appFactories.factory("SubjectsToGraph", function($FirebaseArray) {
  return $FirebaseArray.$extendFactory({
    exportGraph: function() {
      var subj = this._list,
        edges = [];

      for (var i = 0, len = subj.length; i < len; i++) {
        var subjA = subj[i];
        for (var j = i + 1; j < len; j++) {

          var connections = [],
            subjB = subj[j];
          for (var k = 0, lenA = subjA.Provides.length; k < lenA; k++) {
            for (var l = 0, lenB = subjB.Depends.length; l < lenB; l++) {

              if (subjA.Provides[k] == subjB.Depends[l]) {
                connections.push(subjA.Provides[k]);
              }
            }
          }

          if (connections.length > 0) {
            edges.push({
              from: subjA,
              to: subjB,
              connections: connections
            })
          }
        }
      }
      return edges;
    }
  });
})
}());