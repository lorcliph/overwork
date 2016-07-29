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
            $http.get('/api/works/today').then(
                function success(res){
                    if(res.data) {
                        $scope.work = res.data;
                        console.log('work :'+JSON.stringify($scope.work));
                        if($scope.work.status=='waiting'){
                            console.log('is waiting');
                            $scope.updateDisabled = false;
                            $scope.finishDisabled = true;
                            $scope.estimateTime = moment().tz('Asia/Tokyo').set({'hour':17, 'minute':45, 'second':0, 'millisecond':0}).format('HH:mm');
                        }else if($scope.work.status=='estimated') {
                            console.log('is estimated');
                            $scope.estimateTime = moment($scope.work.estimateTime).format('HH:mm');
                            $scope.message = "will finish work at "+$scope.estimateTime;
                            $scope.updateDisabled = false;
                            $scope.finishDisabled = false;
                        }else{
                            console.log('is other '+ $scope.work.status);
                            $scope.message = "finished work at "+moment($scope.work.finishedTime).tz('Asia/Tokyo').format('HH:mm');
                            $scope.updateDisabled = false;
                            $scope.finishDisabled = true;
                        }
                    }else{
                        console.log(JSON.stringify(res));
                        alert(JSON.stringify('error.'));
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

                $scope.work.estimateTime = moment($scope.estimateTime,'hh:mm').toDate();
                $scope.work.status = 'estimated';

                console.log('newWork :' + JSON.stringify($scope.work));
                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                $http.put('/api/works/',{'work':$scope.work}).then(
                    function success(res){
                        console.log(JSON.stringify(res.data));
                        $window.location.reload(true);
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

                console.log('moment().toDate() : '+moment().toDate());
                $scope.work.finishedTime = moment().tz('Asia/Tokyo').toDate();
                $scope.work.status = 'finished';

                console.log('newWork :' + JSON.stringify($scope.work));
                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                $http.put('/api/works/',{'work':$scope.work}).then(
                    function success(res){
                        console.log(JSON.stringify(res.data));
                        $window.location.reload(true);
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