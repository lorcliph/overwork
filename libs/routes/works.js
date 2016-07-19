var express = require('express');
var passport = require('passport');
var router = express.Router();

var async = require('async');
var moment = require('moment');

var libs = '/src/libs/';
var log = require(libs + 'log')(module);
var db = require(libs + 'db/mongoose');
var Works = require(libs + 'model/work');
var User = require(libs + 'model/user');

router.get('/:id', passport.authenticate('bearer', { session: false }),
    function(req, res) {

        Works.findById(req.params.id, function(err, work){
            if(!err) {
                log.info('/info work found :'+JSON.stringify(work));
                res.json(work);
            }else {
                log.info('/info error');
                return log.error(err);
            }
        });
    }
);

router.get('/', passport.authenticate('bearer', {session: false}),
    function(req, res){
        log.info('get works req:'+ JSON.stringify(req.authInfo));
        // if(req.authInfo.user.authority != "admin"){
        //     res.status(401).send('unauthorized request.');
        // }
        Works.find({userId: req.authInfo.user._id}, function(err, works){
            if(!err) {
                log.info('/ work found :'+JSON.stringify(works));
                res.json(works);
            }else {
                log.info('/ error');
                return log.error(err);
            }

        });
    }
);

// router.post('/', passport.authenticate('bearer', {session: false}),
//     function(req, res){
//
//         log.info('POST Works req:'+ JSON.stringify(req.body.work));
//
//         var work = new Work({
//             userId: req.body.work.userId,
//             workDate: req.body.work.workDate,
//             userIdWorkDate: req.body.work.userId + req.body.work.workDate, //the unique field.
//             estimateTime:req.body.work.estimateTime,
//             status:req.body.work.status,
//             finishedTime:req.body.work.finishedTime
//         });
//
//         work.save(function(err, work) {
//             if(!err) {
//                 log.info("New work - %s:%s", work.workDate, work.status);
//                 res.json({message: 'New work added', work: work});
//             }else {
//                 log.error(err);
//                 res.json(err) ;
//             }
//         });
//     }
// );

router.put('/', passport.authenticate('bearer', {session: false}),
    function(req, res){

        new Work(req.doby.work).save(function(err, work) {
            if(!err) {
                log.info("Update work - %s:%s", work.workDate, work.status);
                res.json({message: 'work updated', work: work});
            }else {
                return log.error(err);
            }
        });
    }
);

router.delete('/', passport.authenticate('bearer', {session: false}),
    function(req, res){

        Works.findById(req.body.workId, function(err, work){

            if(!work){ res.status(404).send('work not found.'); }

            work.delete(function(err, work){
               if(err){ res.status(500).send('internal server failure.')}
                Work.findById(user.userId, function(err, work){
                    if(work) {
                        res.send('work not deleted...: ' + work);
                    }else{
                        res.send('work deleted');
                    }
                })
            });
        });
    }
);


router.get('/check', passport.authenticate('bearer',{session: false}),
    function(req,res){

        var searchKey = req.authInfo.user._id + moment().format('YYYYMMDD');
        log.info('/check searchKey :'+searchKey);
        Works.findOne({userIdWorkDate:searchKey}, function(err,work){
                if(!err){
                    if(work){
                       res.JSON({message:'work is found',work: work});
                    }else{
                        var newWork = new Work({
                            userId: req.authInfo.user._id,
                            workDate: moment({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).toDate(),
                            userIdWorkDate: req.authInfo.user._id + moment().format('YYYYMMDD'), //the unique field.
                            estimateTime:moment({'hour':17, 'minute':45, 'second':0, 'millisecond':0}).toDate(),
                            status:'waiting'
                        });

                        newWork.save(function(err, work) {
                            if(!err) {
                                log.info("New work - %s:%s", work.workDate, work.status);
                                res.json({message: 'New work added', work: work});
                            }else {
                                log.error(err);
                                res.json({message: 'error',err: err}) ;
                            }
                        });
                    }
                }
            }
        );
    }
);

module.exports = router;