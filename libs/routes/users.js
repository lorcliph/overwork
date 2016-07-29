var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = '/src/libs/';
var log = require(libs + 'log')(module);
var db = require(libs + 'db/mongoose');
var User = require(libs + 'model/user');

router.get('/id/:id', passport.authenticate('bearer', { session: false }),
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

router.get('/me', passport.authenticate('bearer', { session: false }),
    function(req, res) {
                res.json(req.user);
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
        log.info('authInfo:'+JSON.stringify(req.user));
        if(req.user.authority != "admin"){ res.status(401).send('unauthorized request.'); }
        log.info('req.body.user:'+JSON.stringify(req.body.user));
        User.findOneAndUpdate({_id:req.body.user._id},
            {
                username: req.body.user.username,
                password: req.body.user.password,
                group: {
                    level1: req.body.user.group.level1,
                    level2: req.body.user.group.level2,
                    level3: req.body.user.group.level3
                    },
                authority: req.body.user.authority
            },function(err, user) {
                if(!err) {
                    log.info("Update user - %s:%s", user.userName, user._id);
                    res.json({message: 'New user added', user: user});
                }else {
                    log.info('user save err:'+JSON.stringify(err));
                    return log.error(err);
                }
            });
    }
);

router.delete('/:id', passport.authenticate('bearer', {session: false}),
    function(req, res){
        if(req.user.authority != "admin"){ res.status(401).send('unauthorized request.'); }
        log.info('remove userId:'+req.params.id);
        User.remove({_id:req.params.id}, function(err, user){

            if(!err) {
                log.info("deleted user");
                res.json({message: 'user deleted'});
            }else {
                log.info('user delete err:'+JSON.stringify(err));
                return log.error(err);
            }

        });
    }
);


module.exports = router;