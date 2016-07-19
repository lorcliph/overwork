/**
 * Created by shinyaohnuki on 2016/06/23.
 */
var app = angular.module('login', ['ngCookies','auth']);

app.controller("loginCtrl", ['$scope','$http','$cookies','$window','auth', function($scope, $http, $cookies, $window, auth) {
        console.log('loginCtrl started');

        auth.getAccessToken().then(
            function success(accessToken){
                console.log("success accessToken:"+accessToken);
                $window.location.href = "users.html";
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
                        $window.location.href = "users.html";
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