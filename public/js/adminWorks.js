/**
 * Created by shinyaohnuki on 2016/06/23.
 */
var app = angular.module('adminWorks', ['datatables','ngCookies','auth','ui.bootstrap']);

app.controller('adminWorksCtrl', ['$scope','$http','$cookies','$window','auth','$timeout','$uibModal', function ($scope, $http, $cookies, $window, auth, $timeout, $uibModal) {

    var userId ="";
    var match = location.search.match(/id=(.*?)(&|$)/);
    if(match) {
        userId = decodeURIComponent(match[1]);
    }
    
    auth.getAccessToken().then(
        function success(accessToken){
            console.log("accessToken :"+accessToken);

            $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
            $http.get('/api/works/admin/today').then(
                function success(res){
                    console.log('get works/admin/today responce : ' + JSON.stringify(res.data));
                    $timeout(function() {
                        $scope.works = res.data;
                    },0);
                },
                function failure(res) {
                    console.log('get works/admin/today error : ' + JSON.stringify(res));
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
        return moment(workDate).format("YYYY/MM/DD");
    };
    $scope.formatTime = function(time){
        return moment(time).format("HH:mm");
    };

    $scope.approveTime = function(work){
        console.log('approveTime : ' + JSON.stringify($scope.work));
        auth.getAccessToken().then(
            function success(accessToken){

                work.status = 'approved';
                work.declineReason = '';

                console.log('updateWork :' + JSON.stringify(work));
                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                $http.put('/api/works/',{'work':work}).then(
                    function success(res){
                        console.log(JSON.stringify(res.data));
                        alert('status updated.');
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
                $scope.currentWork = null;
            },
            function failure(){
                console.log('getAccessToken failure');
                $Scope.currentWork = null;
                $window.location.href = "login.html";
            }
        );
    };
    $scope.declineTime = function(){
        console.log('declineTime : ' + JSON.stringify($scope.currentWork));
        auth.getAccessToken().then(
            function success(accessToken){
                $scope.currentWork.status = 'declined';

                console.log('updateWork :' + JSON.stringify($scope.currentWork));
                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                $http.put('/api/works/',{'work':$scope.currentWork}).then(
                    function success(res){
                        console.log(JSON.stringify(res.data));
                        alert('status updated.');
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
                $scope.currentWork = null;
            },
            function failure(){
                console.log('getAccessToken failure');
                $Scope.currentWork = null;
                $window.location.href = "login.html";
            }
        );
    };
    $scope.openDeclineForm = function(currentWork){
        $scope.currentWork = currentWork;
        $uibModal.open({
            templateUrl: "T_declineForm",
            scope: $scope
        });
    }
}]);