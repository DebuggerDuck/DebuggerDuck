const mongoose = require ('mongoose');
const shortid = require ('shortid');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

// initiate a database variable to attach schemas to
let db = {};

const UserSchema = new Schema ({
	//mongoose will automatically create a unique id, so no need to manually create one
	userName: String,
	fb_id: String,
	picture: String,
	phoneNumber: String,
	groups: [{ type: String, ref: 'Group' }]
});

// let getNameFromFb = function(input){
// 	//TODO?: Using fbs api, retrieve the name from fb
// 	return input;
// }
// let getPicFromFb = function(input){
// 	//TODO: Using fbs api, retrieve the picture from fb
// 	return input;
// }

// UserSchema.pre('save', function(next) {
//   let userName = getNameFromFb(input);
//   this.userName = name;
//   let picture = getPicFromFb(input);
//   this.picture = picture;
//   next();
// });

const GroupSchema = new Schema ({
	_id: {
    type: String,
    'default': shortid.generate
	},
	name: String,
	users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	messages: [{
		userName: String,
		user_id: String,
		picture: String,
		text: String,
		createdAt: { type : Date, default: Date.now }
	}]
})

const OrderSchema = new Schema ({
	// Will automatically generate order id
	orderer_userName: String,
	location: String,
	time: String,
	group_id: String,
	active: Boolean,
	picture: String,
	requests: [{userName: String, user_id: String, picture: String, text: String}],
	createdAt: { type : Date, default: Date.now }
})


db.User = mongoose.model('User', UserSchema);
db.Group = mongoose.model('Group', GroupSchema);
db.Order = mongoose.model('Order', OrderSchema);

module.exports = db;
