angular.module('dataCurrency', ['socket-io']);

angular.module('dataCurrency').controller('socketController', ['$scope', '$timeout', 'socket', function($scope, $timeout, socket)
{
  $scope.status = "Listening..."
  $scope.messages = [];

  socket.on("message", function(msg)
  {
    $scope.status = "Received Message: " + msg;
    $timeout(function()
    {
      $scope.status = "Listening...";
    }, 1000);
  });

  socket.on("init", function(data)
  {
      console.log(data);
  });

}]);
