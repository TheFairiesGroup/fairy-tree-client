"use strict";
(function() {
    var factories = angular.module("fairyTree.factories", ["firebase"]);

    factories.factory("graphFactory", function($FirebaseArray) {
        return $FirebaseArray.$extendFactory({
            buildEdges: function() {
                var subjects = this.$list,
                    edges = [];

                subjects.forEach(function(subjectA, i) {
                    var connections = [],
                        dependentTerms = subjectA.Depends || [];

                    var dependencies = subjects.filter(function(subjectB, j) {
                        if (i === j) return false;

                        if (!Array.isArray(subjectB.Provides)) {
                            subjectB.Provides = [];
                        }

                        var commonTerms = [];
                        dependentTerms.forEach(function(term) {
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

                    dependencies.forEach(function(dependency, i) {
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
