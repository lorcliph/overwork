/**
 * Created by shinyaohnuki on 2016/06/23.
 */
var app = angular.module('works', ['datatables','ngCookies','auth']);

app.controller('worksCtrl', ['$scope','$http','$cookies','$window','auth','$timeout', function ($scope, $http, $cookies, $window, auth, $timeout) {

    var userId ="";
    var match = location.search.match(/id=(.*?)(&|$)/);
    if(match) {
        userId = decodeURIComponent(match[1]);
    }
    
    auth.getAccessToken().then(
        function success(accessToken){
            console.log("accessToken :"+accessToken);

            $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
            $http.get('/api/works/user/' + userId).then(
                function success(res){
                    console.log(JSON.stringify(res.data));
                    $timeout(function() {
                        $scope.works = res.data;
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
    $scope.updateWork = function(){
        $window.location.href = "overWork.html";
    };
    $scope.logout = function(){
        $cookies.remove("accessToken");
        $cookies.remove("refreshToken");
        $window.location.href = "login.html";
    };
    $scope.formatDate = function(workDate){
        console.log("formatDate:"+JSON.stringify(workDate));
        if(workDate) {
            return moment(workDate).format("YYYY/MM/DD");
        }else{
            return "";
        }
    };
    $scope.formatTime = function(time){
        console.log("formatTime:"+JSON.stringify(time));
        if(time) {
            return moment(time).format("HH:mm");
        }else{
            return "";
        }
    };
}]);