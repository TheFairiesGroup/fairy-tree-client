(function () {
  var self = this;
  self.majors = [];

  var appControllers = angular.module("appControllers", ["firebase"]);

  appControllers.controller('MajorsController', function MajorsController($scope, $firebase) {
    var ref = new Firebase("https://fairytree.firebaseio.com/Majors");
    self.majors = $firebase(ref).$asArray();

    this.array = self.majors;

    this.select = function (major) {
      console.log(major.$id);
    };
  });

  appControllers.controller('SubjectsController', function SubjectsController($scope, $firebase, $routeParams) {
    var ref = new Firebase("https://fairytree.firebaseio.com/Subjects");
    this._subjects = $firebase(ref).$asArray();
console.log($firebase(ref));


    console.log(this._subjects);

    this.edges = match(this._subjects);
    console.log(this.edges);
  });

  function match(subj){
    var edges = [];

    for(var i = 0, len = subj.length; i < len; i++){
      var subjA = subj[i];
      for(var j = i + 1; j < len; j++){

        var connections = [],
            subjB = subj[j];
        for(var k = 0, lenA = subjA.Provides.length; k < lenA; k++) {
          for(var l = 0, lenB = subjB.Depends.length; l < lenB; l++) {
            
              console.log(1)
            if(subjA.Provides[k] == subjB.Depends[l]){
              connections.push(subjA.Provides[k]);
            }
          }
        }

        if(connections.length > 0){
          edges.push({
            from:subjA,
            to:subjB,
            connections: connections
          })
        }
      }
    }

    return edges;
  }
}());