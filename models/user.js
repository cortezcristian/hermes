// User Model
// -----------------------------

// Modules Dependencies:
//  - Mongoose (http://mongoosejs.com/docs/guide.html)
//  
var mongoose = require('mongoose'), 
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var ChatRoom = require('./chatroom.js');
var ChatRecord = require('./chatrecord.js');


var userSchema = new Schema({
    name          : String, 
    email         : String,
    password      : String,
    first_name    : String,
    last_name     : String,
    avatar        : String,
    role          : { type: String, default: 'user' },
    idSector      : { type: Schema.Types.ObjectId, ref: 'Sector' },
    idOffice      : { type: Schema.Types.ObjectId, ref: 'Office' },
    isonline      : { type: Boolean, default: false },
    isactive      : { type: Boolean, default: true },
    last_login    : Date,
    last_activity : Date,
    job_desc      : String,
    phone         : String,
    chat_windows  : String,
	created       : Date         
});

// ### Hooks 
// #### Pre-Save
userSchema.pre("save", function(next) {
    if(!this.created)
        this.created = new Date();
    if(this.isModified('password'))
        this.password = crypto.createHash('md5').update(this.password).digest("hex");
    next();
});

// ### Method: authenticate
userSchema.method('authenticate', function(password) {
    var user = this;
    return crypto.createHash('md5').update(password).digest("hex") === user.password;
});

// ### Method: openPrivateChat
userSchema.method('openPrivateChat', function(userto, cb) {
    var user = this;
    ChatRoom.findOrCreate(user._id, userto, cb);
});

// ### Method: openPrivateChat
userSchema.method('readChatMsg', function(msgid, cb) {
    var user = this;
    ChatRecord.makrAsRead(user._id, msgid, cb);
});

// ### Static:
userSchema.statics.customMethod = function (paramid, cb) {
  var User = this;
  User.findOne({ _id: paramid}, function(err, user){
      cb(err, user);
  });
}

// Export module
module.exports = mongoose.model('User', userSchema);
