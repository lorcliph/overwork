/**
 * Created by shinyaohnuki on 2016/06/23.
 */
var myapp = angular.module('userDetail', ['ngCookies','auth']);
myapp.controller('userDetailCtrl', ['$scope','$http','$cookies','$window','auth','$timeout', function ($scope, $http, $cookies, $window, auth, $timeout) {

    var userId ="";
    var match = location.search.match(/id=(.*?)(&|$)/);
    if(match) {
        userId = decodeURIComponent(match[1]);
    }

    $scope.createdAt = null;

    console.log("userDetail userId:"+userId);
    auth.getAccessToken().then(
        function success(accessToken){
            console.log("userDetail accessToken :"+accessToken);

            $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
            $http.get('/api/users/id/' + userId).then(
                function success(res){
                    console.log("userDetail api res:" + JSON.stringify(res.data));
                    $timeout(function(){
                        $scope.user = res.data;
                        $scope.createdAt = moment($scope.user.created).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm:ss');
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

                console.log(JSON.stringify($scope.user));
                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                $http.put('/api/users/', {'user':$scope.user}).then(
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
                $http.delete('/api/users/' + $scope.user._id).then(
                    function success(res){
                        console.log(JSON.stringify(res.data));
                        alert('user deleted successfully');
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