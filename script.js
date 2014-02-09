angular.module('dataCurrency', ['socket-io']);

angular.module('dataCurrency').controller('socketController', ['$scope', 'socket', function($scope, socket){
  $scope.trueCount = 0;
  //var socket = io.connect();
  socket.on("message", function(msg){
      $scope.trueCount++;
      //$scope.$apply();
  });
}]);
