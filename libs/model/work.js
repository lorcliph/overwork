var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Work = new Schema({
		userId: {
			type: String,
			required: true
		},
		workDate: {
			type: Date,
			required: true
		},
		userIdWorkDate: {
			type: String,
			required: true
		},
		estimateTime: {
			type: Date
		},
		status: {
			type: String,
			enum:['waiting','estimated','finished']
		},
		finishedTime: {
			type: Date
		}
	});

Work.virtual('workId')
.get(function () {
	return this.id;
});

module.exports = mongoose.model('Work', Work);
