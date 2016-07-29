/**
 * Created by shinyaohnuki on 2016/06/23.
 */
var app = angular.module('login', ['ngCookies','auth']);

app.controller("loginCtrl", ['$scope','$http','$cookies','$window','auth', function($scope, $http, $cookies, $window, auth) {
        console.log('loginCtrl started');

        auth.getAccessToken().then(
            function success(accessToken){
                console.log("success accessToken:"+accessToken);

                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                $http.get('/api/users/me').then(
                    function success(res){
                        var user = res.data;
                        if(user.authority=='admin'){
                            $window.location.href = "users.html";
                        }else{
                            $window.location.href = "overWork.html";
                        }
                    },function failure(res) {
                        console.log('http error' + JSON.stringify(res));
                        $cookies.remove("accessToken");
                        $cookies.remove("refreshToken");
                        alert('failed to login.');
                    }
                );
            },
            function failure(){
                console.log("failed to get accessToken.");
            }
        );

        $scope.submitLogin = function() {
            if ($scope.user.username && $scope.user.password) {
                console.log("submitLogin :" + JSON.stringify($scope.user));
                auth.authenticateUser($scope.user).then(
                    function success(accessToken) {
                        $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                        $http.get('/api/users/me').then(
                            function success(res){
                                var user = res.data;
                                if(user.authority=='admin'){
                                    $window.location.href = "users.html";
                                }else{
                                    $window.location.href = "overWork.html";
                                }
                            },function failure(res) {
                                console.log('http error' + JSON.stringify(res));
                                $cookies.remove("accessToken");
                                $cookies.remove("refreshToken");
                                alert('failed to login.');
                            }
                        );
                    }, function failure(res) {
                        alert("Authentication failed.")
                        console.log(JSON.stringify(res));
                    }
                );
            }else{
                alert("username or password missing");
            }
        }
    }]);