angular.module('dataCurrency', ['socket-io']);

angular.module('dataCurrency').controller('SocketController', ['$scope', '$timeout', 'socket', function($scope, $timeout, socket)
{
  $scope.dataObjectsMap = {};

  socket.on("message", function(data)
  {
      $scope.dataObjectsMap = angular.fromJson(data);
  });

  socket.on("init", function(data)
  {
      $scope.dataObjectsMap = angular.fromJson(data);
  });

}]);
