/**
 * Created by shinyaohnuki on 2016/06/23.
 */
var app = angular.module('addUser', ['ngCookies','auth']);

app.controller('addUserCtrl', ['$scope','$http','$cookies','$window','auth', function ($scope, $http, $cookies, $window, auth) {

    $scope.user = {};
    $scope.authorities = ["user","admin"];
    $scope.user.authority = $scope.authorities[0];

    $scope.addUser = function(){
        console.log(JSON.stringify($scope.user));
        auth.getAccessToken().then(
            function success(accessToken){

                console.log(JSON.stringify($scope.user));
                if(!$scope.user.username){
                    alert("userName is missing.");
                    return;
                }
                if(!$scope.user.password){
                    alert("password is missing.");
                    return;
                }
                if(!$scope.user.level1){
                    alert("group level1 is missing.");
                    return;
                }
                if(!$scope.user.authority){
                    alert("authority is missing.");
                    return;
                }

                var postData = {
                    user: {
                        username: $scope.user.username,
                        password: $scope.user.password,
                        group: {
                            level1: $scope.user.level1,
                            level2: $scope.user.level2,
                            level3: $scope.user.level3
                        },
                        authority: $scope.user.authority
                    }
                };

                console.log('postData :' + JSON.stringify(postData));
                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                $http.post('/api/users/',postData).then(
                    function success(res){
                        console.log(JSON.stringify(res.data));
                        alert(JSON.stringify(res.data));
                        $window.location.href = "users.html";
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
}]);