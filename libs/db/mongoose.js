var mongoose = require('mongoose');

var libs = '/src/libs/';

var log = require(libs + 'log')(module);
var config = require(libs + 'config');
var User = require(libs + 'model/user');
var Client = require(libs + 'model/client');

log.info("process.env.MONGO_PORT_27017_TCP_ADDR : " + process.env.MONGO_PORT_27017_TCP_ADDR );
log.info("process.env.MONGO_PORT_27017_TCP_ADDR : " + process.env.MONGO_PORT_27017_TCP_PORT );
mongoose.connect("mongodb://mongo:27017/apiDB");

var db = mongoose.connection;

db.on('error', function (err) {
	log.error('Connection error:', err.message);
});

db.once('open', function callback () {
	log.info("Connected to DB!");
	User.count({username: config.get("default:user:username")},function(err,count){
		log.info("count:" + count);
		log.info("err:" + err);
		if(!count){
			log.info("initializing...");
			var newUser = new User({
				username: config.get("default:user:username"),
				password: config.get("default:user:password"),
				group: config.get("default:user:group"),
				authority: config.get("default:user:authority")
			});

			newUser.save(function(err, user) {
				if(!err) {
					log.info("New user - %s:%s", user.username, user.password);
				}else {
					return log.error(err);
				}
			});

			var client = new Client({
				name: config.get("default:client:name"),
				clientId: config.get("default:client:clientId"),
				scope: config.get("default:client:scope"),
				clientSecret: config.get("default:client:clientSecret")
			});

			client.save(function(err, client) {

				if(!err) {
					log.info("New client - %s:%s", client.clientId, client.clientSecret);
				} else {
					return log.error(err);
				}

			});
			log.info("initialization done");
		}
	});
});

module.exports = mongoose;