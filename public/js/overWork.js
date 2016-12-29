/**
 * Created by shinyaohnuki on 2016/06/23.
 */
var app = angular.module('overWork', ['ngCookies','auth','ui.bootstrap']);

app.controller('overWorkCtrl', ['$scope','$http','$cookies','$window','auth','$interval', function ($scope, $http, $cookies, $window, auth, $interval) {

    $scope.estimateTime = moment({h:17, m:45,s:0,ms:0}).tz('Asia/Tokyo').toDate();
    var today = moment({h:0, m:0, s:0, ms:0}).tz('Asia/Tokyo').format("MM/DD");
    $scope.todayStr = today;
    $scope.statusTag = '未申請';
    $scope.message1 = '今日（' + today + '） は何時まで働くの？';
    $scope.message2 = '';
    $scope.work = {};

    $scope.hourStep = 1;
    $scope.minuteStep = 15;
    $scope.amPm = true;

    $scope.updateStatus = function() {
        auth.getAccessToken().then(
            function success(accessToken) {
                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                $http.get('/api/works/today').then(
                    function success(res) {
                        if (res.data) {
                            $scope.work = res.data;
                            console.log('work :' + JSON.stringify($scope.work));
                            if ($scope.work.status == 'waiting') {
                                console.log('is waiting');
                                $scope.statusTag = '未申請';
                                $scope.hideEstimate = false;
                                $scope.hideShowBtn = true;
                                $scope.hideFinish = true;
                                $scope.btnInfo = true;
                                $scope.btnAlert = false;
                                $scope.btnSuccess = false;
                                $scope.btnDenger = false;
                                $scope.estimateTime = moment().tz('Asia/Tokyo').set({
                                    'hour': 17,
                                    'minute': 45,
                                    'second': 0,
                                    'millisecond': 0
                                })
                            } else if ($scope.work.status == 'estimated') {
                                console.log('is estimated');
                                $scope.statusTag = '承認待ち';
                                $scope.estimateTime = moment($scope.work.estimateTime).format('HH:mm');
                                $scope.message1 = $scope.estimateTime + " まで働きます";
                                $scope.message2 = '残業理由：' + $scope.work.workReason;
                                $scope.hideEstimate = true;
                                $scope.hideShowBtn = false;
                                $scope.hideFinish = false;
                                $scope.btnInfo = false;
                                $scope.btnAlert = true;
                                $scope.btnSuccess = false;
                                $scope.btnDenger = false;
                            } else if ($scope.work.status == 'approved') {
                                console.log('is approved');
                                $scope.statusTag = '承認済み';
                                $scope.estimateTime = moment($scope.work.estimateTime).format('HH:mm');
                                $scope.message1 = $scope.estimateTime + " まで働きます";
                                $scope.message2 = '';
                                $scope.hideEstimate = true;
                                $scope.hideShowBtn = false;
                                $scope.hideFinish = false;
                                $scope.btnInfo = false;
                                $scope.btnAlert = false;
                                $scope.btnSuccess = true;
                                $scope.btnDenger = false;
                            } else if ($scope.work.status == 'declined') {
                                console.log('is declined');
                                $scope.statusTag = '却下';
                                $scope.estimateTime = moment($scope.work.estimateTime).format('HH:mm');
                                $scope.message1 = '内容を見直し、再申請してください';
                                $scope.message2 = '却下理由:' + $scope.work.declineReason;
                                $scope.hideEstimate = false;
                                $scope.hideShowBtn = true;
                                $scope.hideFinish = false;
                                $scope.btnInfo = false;
                                $scope.btnAlert = false;
                                $scope.btnSuccess = false;
                                $scope.btnDenger = true;
                            } else {
                                console.log('is other ' + $scope.work.status);
                                $scope.statusTag = '業務終了';
                                $scope.message1 = 'お疲れ様でした。';
                                $scope.message2 = '退社時間：' + moment($scope.work.finishedTime).tz('Asia/Tokyo').format('HH:mm');
                                $scope.hideEstimate = true;
                                $scope.hideShowBtn = false;
                                $scope.hideFinish = false;
                                $scope.btnInfo = false;
                                $scope.btnAlert = false;
                                $scope.btnSuccess = true;
                                $scope.btnDenger = false;
                            }
                        } else {
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
            }, function failure() {

            }
        )
    };

    $scope.updateStatus();

    $scope.updateEstimateTime = function(){

            console.log(JSON.stringify($scope.work));
            if ($scope.workReason) {
                auth.getAccessToken().then(
                    function success(accessToken) {

                        $scope.work.estimateTime = moment($scope.estimateTime, 'hh:mm').toDate();
                        $scope.work.status = 'estimated';
                        $scope.work.workReason = $scope.workReason;

                        console.log('newWork :' + JSON.stringify($scope.work));
                        $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                        $http.put('/api/works/', {'work': $scope.work}).then(
                            function success(res) {
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
                    function failure() {
                        console.log('getAccessToken failure');
                        $window.location.href = "login.html";
                    }
                );
            } else {
                alert('残業理由を入力してください。')
            }
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

    $scope.showEstimateTime = function(){
        $scope.hideEstimate = false;
        $scope.hideShowBtn = true;
        $scope.hideFinish = true;
    };
    
    $scope.logout = function(){
        $cookies.remove("accessToken");
        $cookies.remove("refreshToken");
        $window.location.href = "login.html";
    };
}]);