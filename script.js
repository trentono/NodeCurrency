angular.module('dataCurrency', []);

angular.module('dataCurrency').controller('socketController', ['$scope', function($scope){
  $scope.trueCount = 0;
  var socket = io.connect();
  socket.on("message", function(msg){
      $scope.trueCount++;
      $scope.$apply();
  });
}]);
