var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = '/src/libs/';
var log = require(libs + 'log')(module);
var db = require(libs + 'db/mongoose');
var User = require(libs + 'model/user');

router.get('/:id', passport.authenticate('bearer', { session: false }),
    function(req, res) {

        User.findById(req.params.id, function(err, user){
            if(!err) {
                log.info('/info user found :'+JSON.stringify(user));
                res.json(user);
            }else {
                log.info('/info error');
                return log.error(err);
            }
        });
    }
);

router.get('/', passport.authenticate('bearer', {session: false}),
    function(req, res){
        log.info('get Users req:'+ JSON.stringify(req.authInfo));
        // if(req.authInfo.user.authority != "admin"){
        //     res.status(401).send('unauthorized request.');
        // }
        User.find({}, function(err, users){
            if(!err) {
                log.info('/ user found :'+JSON.stringify(users));
                res.json(users);
            }else {
                log.info('/ error');
                return log.error(err);
            }

        });
    }
);

router.post('/', passport.authenticate('bearer', {session: false}),
    function(req, res){

        log.info('POST Users req:'+ JSON.stringify(req.body.user));
        //if(req.authInfo.user.authority != "admin"){ res.status(401).send('unauthorized request.'); }

        var user = new User({
            username: req.body.user.username,
            password: req.body.user.password,
            group: {
                level1: req.body.user.group.level1,
                level2: req.body.user.group.level2,
                level3: req.body.user.group.level3
            },
            authority: req.body.user.authority
        });

        user.save(function(err, user) {
            if(!err) {
                log.info("New user - %s:%s", user.userName, user.password);
                res.json({message: 'New user added', user: user});
            }else {
                log.error(err)
                res.json(err) ;
            }
        });
    }
);

router.put('/', passport.authenticate('bearer', {session: false}),
    function(req, res){
        if(req.authInfo.user.authority != "admin"){ res.status(401).send('unauthorized request.'); }
        new User(req.doby.user).save(function(err, user) {
            if(!err) {
                log.info("Update user - %s:%s", user.userName, user._id);
                res.json({message: 'New user added', user: user});
            }else {
                return log.error(err);
            }
        });
    }
);

router.delete('/', passport.authenticate('bearer', {session: false}),
    function(req, res){
        if(req.authInfo.user.authority != "admin"){ res.status(401).send('unauthorized request.'); }
        User.findById(req.body.userId, function(err, user){

            if(!user){ res.status(404).send('user not found.'); }

            user.delete(function(err, user){
               if(err){ res.status(500).send('internal server failure.')}
                User.findById(user.userId, function(err, user){
                    if(user) {
                        res.send('user not deleted...: ' + user);
                    }else{
                        res.send('user deleted');
                    }
                })
            });
        });
    }
);


module.exports = router;