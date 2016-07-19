/**
 * Created by shinyaohnuki on 2016/06/28.
 */
var app = angular.module('auth',['ngCookies']);

app.factory('auth',['$cookies','$http','$q',function($cookies,$http,$q){
    var tokens = "";

    return {
        getAccessToken: function () {

            var defer = $q.defer();

            var accessToken = $cookies.get("accessToken");
            var refreshToken = $cookies.get("refreshToken");

            if (accessToken) {
                defer.resolve(accessToken);
            }else if(refreshToken){
                var postData = {
                    "grant_type": "refresh_token", //grant_type is fixed name for "oauth2orize"
                    "client_id": "adminConsole", //client_id is fixed name for "passport-oauth2-client-password"
                    "client_secret": "ClientSecretForAdminConsole", //client_secret is fixed name for "passport-oauth2-client-password"
                    "refresh_token": refreshToken //refresh_token is fixed name for "oauth2orize"
                };

                $http.post('/api/oauth/token',postData).then(
                    function success(res) {
                        if (res) {
                            console.log(JSON.stringify(res));
                            accessToken = res.data.access_token;
                            $cookies.put("accessToken",res.data.access_token);
                            $cookies.put("refreshToken",res.data.refresh_token);
                            defer.resolve(accessToken);
                        }else{
                            console.log('post res is null');
                            defer.reject(null);
                        }
                    },
                    function failed(res) {
                        console.log('http error status:'+JSON.stringify(res));
                        $cookies.remove("accessToken");
                        $cookies.remove("refreshToken");
                        defer.reject(null);
                    }
                );
            }
            return defer.promise;
        },
        authenticateUser: function(user){

            var defer = $q.defer();
            
            console.log(JSON.stringify(user));

            var postData = {
                "grant_type": "password", //grant_type is fixed name for "oauth2orize"
                "client_id": "adminConsole", //client_id is fixed name for "passport-oauth2-client-password"
                "client_secret": "ClientSecretForAdminConsole", //client_secret is fixed name for "passport-oauth2-client-password"
                "username": user.username, //username is fixed name for "oauth2orize"
                "password": user.password //password is fixed name for "oauth2orize"
            };
            console.log('auth data :' + postData);
            // var config = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
            $http.post('/api/oauth/token',postData).then(
                function success(res) {
                    if (res) {
                        console.log(JSON.stringify(res));
                        $cookies.put("accessToken", res.data.access_token);
                        $cookies.put("refreshToken", res.data.refresh_token);
                        defer.resolve(res.data.access_token);
                    } else {
                        defer.reject(null);
                    }
                },
                function failed(res) {
                    console.log("http error. " + JSON.stringify(res))
                    defer.reject(res);
                }
            );

            return defer.promise;
        }
    };
}]);