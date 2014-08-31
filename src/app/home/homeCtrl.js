angular.module('firehose')
    .controller('homeCtrl', ['$scope', '$http', function ($scope, $http) {
        var url = 'http://mapster-panickster.herokuapp.com/firehose';
        $scope.welcomeMsg = 'FIREHOSE from the guys that brought you Panickster and Mapster';
        $scope.data = [];


        $http.get(url).then(function(data){
            $scope.data = data.data.result;
        });
    }]);