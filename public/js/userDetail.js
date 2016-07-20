/**
 * Created by shinyaohnuki on 2016/06/23.
 */
var app = angular.module('userDetail', ['ngCookies','auth']);

app.controller('userDetailCtrl', ['$scope','$http','$cookies','$window','auth','$location','$timeout', function ($scope, $http, $cookies, $window, $location, auth, $timeout) {

    var userId = $location.search()['userId'];

    console.log("userDetail userId:"+userId);
    auth.getAccessToken().then(
        function success(accessToken){
            console.log("userDetail accessToken :"+accessToken);

            $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
            $http.get('/api/users/' + userId).then(
                function success(res){
                    console.log("userDetail api res:" + JSON.stringify(res.data));
                    $timeout(function(){
                        $scope.user = res.data;
                    },0);
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
    $scope.updateUser = function(){
        if(!confirm("update user?")){ return; }
        auth.getAccessToken().then(
            function success(accessToken){
                console.log("accessToken :"+accessToken);
                $scope.login = false;
                $scope.logout = true;

                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                $http.put('/api/users/' + userId, $scope.user).then(
                    function success(res){
                        console.log(JSON.stringify(res.data));
                        alert('user updated successfully');
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
    $scope.deleteUser = function(){
        if(!confirm("delete user?")){ return; }
        auth.getAccessToken().then(
            function success(accessToken){
                console.log("accessToken :"+accessToken);
                $scope.login = false;
                $scope.logout = true;

                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                $http.delete('/api/users/' + userId, $scope.user).then(
                    function success(res){
                        console.log(JSON.stringify(res.data));
                        alert('user deleted successfully');
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