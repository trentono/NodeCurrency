angular.module('dataCurrency', ['socket-io']);

angular.module('dataCurrency').controller('SocketController', ['$scope', '$timeout', 'socket', '$filter', function($scope, $timeout, socket, $filter)
{
  $scope.dataObjectsMap = {};
  $scope.dataObjectRows = [];

  socket.on("dataCacheUpdate", function(data)
  {
    console.log("before " + ($filter('date')($scope.dataObjectsMap[data.id].modifiedDate, 'mediumTime')));
    $scope.dataObjectsMap[data.id] = data;
    console.log("after " + ($filter('date')($scope.dataObjectsMap[data.id].modifiedDate, 'mediumTime')));
    $scope.dataObjectsMap[data.id].updated = true;
    $timeout(function()
    {
      $scope.dataObjectsMap[data.id].updated = undefined;
    }, 2000)
    updateDataObjectRows();
  });

  socket.on("init", function(data)
  {
    $scope.dataObjectsMap = data;
    updateDataObjectRows();
  });

  var updateDataObjectRows = function()
  {
    var rows = [];
    var currentRow = [];

    for ( var key in $scope.dataObjectsMap)
    {
      var dataObject = $scope.dataObjectsMap[key];

      if (dataObject.id % 4 === 0)
      {
        rows.push(currentRow);
        currentRow = [];
      }

      // Note that this adds only the map entry value to the row.
      currentRow.push(dataObject);
    }
    rows.push(currentRow);
    $scope.dataObjectRows = rows;
  };

}]);
