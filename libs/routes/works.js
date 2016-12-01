var express = require('express');
var passport = require('passport');
var router = express.Router();
var moment = require('moment');

var libs = '/src/libs/';
var log = require(libs + 'log')(module);
var db = require(libs + 'db/mongoose');
var Work = require(libs + 'model/work');

//_id pinpoint get
router.get('/work/:id', passport.authenticate('bearer', { session: false }),
    function(req, res) {

        Work.findById(req.params.id, function(err, work){
            if(!err) {
                log.info('work found :'+JSON.stringify(work));
                res.json(work);
            }else {
                log.info('/info error');
                return log.error(err);
            }
        });
    }
);

//get all works related tu userid.
router.get('/user/:userid', passport.authenticate('bearer', { session: false }),
    function(req, res) {

        Work.find({userId:req.params.userid}, function(err, works){
            if(!err) {
                log.info('works found :'+JSON.stringify(works));
                res.json(works);
            }else {
                log.info('/info error');
                return log.error(err);
            }
        });
    }
);

//get todays work
router.get('/today', passport.authenticate('bearer', { session: false }),
    function(req, res) {
        var today = moment({h:0, m:0, s:0, ms:0}).toDate();
        Work.findOne({userId:req.user._id, workDate:today}, function(err, work){
            if(work) {
                log.info('works found :'+JSON.stringify(work));
                res.json(work);
            }else{
                var newWork = new Work({
                    userId: req.user._id,
                    username: req.user.username,
                    workDate: today,
                    userIdWorkDate: req.user._id+moment(today).format('yyyymmdd'),
                    estimateTime: null,
                    finishedTime: null,
                    status:'waiting',
                    workReason:null,
                    declineReason:null
                });

                newWork.save(function(err, work) {
                    if(!err) {
                        log.info('New work');
                        res.json({message: 'New work added', work: work});
                    }else {
                        log.error(err);
                        res.json(err) ;
                    }
                });
            }
        });
    }
);

//get all work(for admin)
router.get('/admin', passport.authenticate('bearer', {session: false}),
    function(req, res){
        if(req.user.authority != "admin"){ res.status(401).send('unauthorized request.'); return; }

        Work.find({}, function(err, works){
            if(!err) {
                log.info('/ user found :'+JSON.stringify(works));
                res.json(works);
            }else {
                log.info('/ error');
                return log.error(err);
            }

        });
    }
);

//get all work(for admin)
router.get('/admin/today', passport.authenticate('bearer', {session: false}),
    function(req, res){
        if(req.user.authority != "admin"){ res.status(401).send('unauthorized request.'); return; }
        var today = moment({h:0, m:0, s:0, ms:0}).toDate();
        Work.find({workDate:today}, function(err, works){
            if(!err) {
                log.info('/ user found :'+JSON.stringify(works));
                res.json(works);
            }else {
                log.info('/ error');
                return log.error(err);
            }

        });
    }
);

router.put('/', passport.authenticate('bearer', {session: false}),
    function(req, res){
        log.info('updateWork req.body.work:'+JSON.stringify(req.body.work));
        Work.update({_id:req.body.work._id},
            {
                estimateTime: req.body.work.estimateTime,
                status: req.body.work.status,
                finishedTime: req.body.work.finishedTime,
                workReason: req.body.work.workReason,
                declineReason: req.body.work.declineReason
            },function(err, work) {
                if(!err) {
                    log.info("Update work :", JSON.stringify(work));
                    res.json({message: 'work updated', work: work});
                }else {
                    log.info('work save err:'+JSON.stringify(err));
                    return log.error(err);
                }
            });
    }
);

router.delete('/:id', passport.authenticate('bearer', {session: false}),
    function(req, res){
        log.info('remove workId:'+req.params.id);
        Work.remove({_id:req.params.id}, function(err, work){

            if(!err) {
                log.info("deleted work");
                res.json({message: 'work deleted'});
            }else {
                log.info('work delete err:'+JSON.stringify(err));
                return log.error(err);
            }

        });
    }
);


module.exports = router;