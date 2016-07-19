var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	
	Client = new Schema({
		name: {
			type: String,
			unique: true,
			required: true
		},
		clientId: {
			type: String,
			unique: true,
			required: true
		},
		scope: [ String ],
		clientSecret: {
			type: String,
			required: true
		}
	});

module.exports = mongoose.model('Client', Client);
