/**
 * Created by shinyaohnuki on 2016/06/23.
 */
var app = angular.module('overWork', ['ngCookies','auth']);

app.controller('overWorkCtrl', ['$scope','$http','$cookies','$window','auth', function ($scope, $http, $cookies, $window, auth) {

    $scope.estimateTime = '';
    $scope.message = 'How long will you work today?';
    $scope.work = {};

    auth.getAccessToken().then(
        function success(accessToken){
            $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
            $http.get('/api/works/check').then(
                function success(res){
                    if(!res.data.err && res.data.work) {
                        $scope.work = res.data.work;
                        console.log('work :'+JSON.stringify($scope.work));
                        $scope.estimateTime = moment($scope.work.estimateTime).format('hh:mm');
                        $scope.messate = $scope.estimateTime;
                        $('#updateBtn').show();
                        $('#finishBtn').show();
                    }else{
                        console.log(JSON.stringify(res.data.err));
                        alert(JSON.stringify(res.data.err));
                    }
                },
                function failure(res) {
                    console.log('http error' + JSON.stringify(res));
                    $cookies.remove("accessToken");
                    $cookies.remove("refreshToken");
                    alert('Signing out');
                    $window.location.href = "login.html";
                }
            );
        },function failure(){
            
        }
    )
    $scope.updateEstimateTime = function(){
        console.log(JSON.stringify($scope.work));
        auth.getAccessToken().then(
            function success(accessToken){

                var newWork = {
                    work: {
                        userId: $scope.work.userId,
                        workDate: $scope.work.workDate,
                        userIdWorkDate: $scope.work.userIdWorkDate,
                        estimateTime:moment($scope.estimateTime,'hh:mm').toDate(),
                        status:'estimated'
                    }
                };

                console.log('newWork :' + JSON.stringify(newWork));
                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                $http.put('/api/works/',newWork).then(
                    function success(res){
                        console.log(JSON.stringify(res.data));
                        alert(JSON.stringify(res.data));
                        $window.location.href = "#";
                    },
                    function failure(res) {
                        console.log('http error' + JSON.stringify(res));
                        $cookies.remove("accessToken");
                        $cookies.remove("refreshToken");
                        alert('Signing out');
                        $window.location.href = "login.html";
                    }
                );
            },
            function failure(){
                console.log('getAccessToken failure');
                $window.location.href = "login.html";
            }
        );
    };

    $scope.finishWork = function(){
        console.log(JSON.stringify($scope.work));
        auth.getAccessToken().then(
            function success(accessToken){

                var newWork = {
                    work: {

                        userId: $scope.work.userId,
                        workDate: $scope.work.workDate,
                        userIdWorkDate: $scope.work.userIdWorkDate,
                        estimateTime:$scope.work.estimatedTime,
                        finishedTime:moment().toDate(),
                        status:'finished'
                    }
                };

                console.log('newWork :' + JSON.stringify(newWork));
                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                $http.put('/api/works/',newWork).then(
                    function success(res){
                        console.log(JSON.stringify(res.data));
                        alert(JSON.stringify(res.data));
                        $window.location.href = "#";
                    },
                    function failure(res) {
                        console.log('http error' + JSON.stringify(res));
                        $cookies.remove("accessToken");
                        $cookies.remove("refreshToken");
                        alert('Signing out');
                        $window.location.href = "login.html";
                    }
                );
            },
            function failure(){
                console.log('getAccessToken failure');
                $window.location.href = "login.html";
            }
        );
    };
    $scope.logout = function(){
        $cookies.remove("accessToken");
        $cookies.remove("refreshToken");
        $window.location.href = "login.html";
    };
}]);