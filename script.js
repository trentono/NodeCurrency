angular.module('dataCurrency', ['socket-io']);

angular.module('dataCurrency').controller('socketController', ['$scope', 'socket', function($scope, socket){
  $scope.trueCount = 0;

  socket.on("message", function(msg){
      $scope.trueCount++;
  });
}]);
