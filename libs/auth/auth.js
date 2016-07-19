var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var libs = '/src/libs/';

var config = require(libs + 'config');

var log = require(libs + 'log')(module);
var User = require(libs + 'model/user');
var Client = require(libs + 'model/client');
var AccessToken = require(libs + 'model/accessToken');
var RefreshToken = require(libs + 'model/refreshToken');

// passport.use(new JsonStrategy(
//     function(userName, password, done) {
//         User.findOne({ userName: userName }, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) { return done(null, false); }
//             if (!user.checkPassword(password)) { return done(null, false); }
//             return done(null, user);
//         });
//     }
// ));

// passport.use(new BasicStrategy(
//     function(userName, password, done) {
//         Client.findOne({ clientId: userName }, function(err, client) {
//             if (err) { 
//             	return done(err); 
//             }
//
//             if (!client) { 
//             	return done(null, false); 
//             }
//
//             if (client.clientSecret !== password) { 
//             	return done(null, false); 
//             }
//
//             return done(null, client);
//         });
//     }
// ));

passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {
        log.info('clientPasswordStrategy clientId:' + clientId + " clientSecret :" + clientSecret );
        Client.findOne({ clientId: clientId }, function(err, client) {
            if (err) {
                log.info('ClientPasswordStrategy error at client finding : ' + JSON.stringify(err));
            	return done(err); 
            }

            if (!client) {
                log.info('ClientPasswordStrategy client is not found');
            	return done(null, false); 
            }

            if (client.clientSecret !== clientSecret) {
                log.info('ClientPasswordStrategy clientSecret unmatch input:'+clientSecret + " db:"+client.clientSecret);
            	return done(null, false); 
            }

            log.info('ClientPasswordStrategy client is found :'+JSON.stringify(client));
            return done(null, client);
        });
    }
));

passport.use(new BearerStrategy(
    function(accessToken, done) {
        log.info("bearerStrategy accessToken:"+accessToken);
        AccessToken.findOne({ token: accessToken }, function(err, token) {
            log.info("bearerStrategy token:"+ JSON.stringify(token));
            if (err) {
                log.info('BearerStrategy error at finding accessToken');
            	return done(err); 
            }

            if (!token) {
                log.info('BearerStrategy accessToken is not found');
            	return done(null, false); 
            }

            if( Math.round((Date.now()-token.created)/1000) > config.get('security:tokenLife') ) {
                log.info('BearerStrategy accessToken expired');
                AccessToken.remove({ token: accessToken }, function (err) {
                    if (err) {
                        log.info('BearerStrategy error at removing expired accessToken');
                    	return done(err);
                    } 
                });

                return done(null, false, { message: 'Token expired' });
            }

            User.findById(token.userId, function(err, user) {
            
                if (err) {
                    log.info('BearerStrategy error at finding User');
                	return done(err); 
                }

                if (!user) {
                    log.info('BearerStrategy User not found');
                	return done(null, false, { message: 'Unknown user' }); 
                }

                log.info('bearerStrategy token.clientID :'+token.clientId);
                Client.findOne({ clientId: token.clientId }, function(err, client){
                    if(err){
                        log.info('BearerStrategy error at finding client');
                        return done(err);
                    }
                    if(!client){
                        log.info('bearerStrategy client not found');
                        return done(null, false, {message: 'Unknown client'});
                    }

                    var info = {"token" : token, "client": client, "user": user};
                    log.info('bearerStrategy authinfo:'+JSON.stringify(info));
                    return done(null, info);
                });
            });
        });
    }
));