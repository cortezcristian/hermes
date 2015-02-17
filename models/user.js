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
    job_desc      : { type: String, default: '-' },
    phone         : { type: String, default: '-' },
    open_chats    : [{ type: Schema.Types.ObjectId, ref: 'User' }],
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

// ### Method: sendPrivateChat
userSchema.method('sendPrivateChat', function(iduserto, msg, cb) {
    var user = this;
    ChatRoom.findOrCreate(user._id, iduserto, function(err, chatroom){
        var chatmsg = new ChatRecord({
            idFrom     : user._id,    
            idTo       : iduserto,
            chatroomTo : chatroom._id,
            message    : msg   
        });
        chatmsg.save(function(err, chatrecord){
            chatroom.history.push(chatrecord);
            chatroom.save(cb);
        });
    });
});

// ### Method: readChatMsg
userSchema.method('readChatMsg', function(msgid, cb) {
    var user = this;
    ChatRecord.markAsRead(user._id, msgid, cb);
});

// ### Method: readMultipleChatMsg
userSchema.method('readMultipleChatMsg', function(msgsCSV, cb) {
    var user = this;
    async.map(msgsCSV.split(","), function(msgid, callback){
        //console.log("removing...", op);
        ChatRecord.makrAsRead(user._id, msgid, function(err, doc){
            callback(err, doc);
        });
    }, function(err, res){
        // console.log(">>>", err, res);    
        cb(err, res)
    });
});

// ### Method: getHistory
userSchema.method('getChatHistory', function(roomid, period, cb) {
    var user = this;
    if(typeof period === 'function'){
        cb = period;
        period = 'all';    
    }
    ChatRoom.findOne({_id:roomid}, function(err, chatroom){
        //Populate all history
        ChatRecord.populate(chatroom, { path: 'history' }, cb);
    });
});

// ### Method: getHistory
userSchema.method('getPrivateChatHistory', function(iduserto, period, cb) {
    var user = this;
    if(typeof period === 'function'){
        cb = period;
        period = 'all';    
    }
    ChatRoom.findOrCreate(user._id, iduserto, function(err, chatroom){
        //Populate all history
        ChatRecord.populate(chatroom, { path: 'history' }, cb);
    });
});

// ### Method: getHistory
userSchema.method('updatePrivateChatHistory', function(iduserto, msghash, cb) {
    var user = this;
    ChatRoom.findOrCreate(user._id, iduserto, function(err, chatroom){
        // Performance: find index of requested msghash, get (msghash, lastmsg]
        // and populate only those
        var indexHash = chatroom.history.indexOf(msghash);
        if(indexHash !== -1) {
            console.log("Slicing...", chatroom.history);
            chatroom.history = chatroom.history.slice(indexHash+1, chatroom.history.length);
            console.log("Sliced...", chatroom.history);
        }
        // Populate all history
        ChatRecord.populate(chatroom, { path: 'history' }, function(err, chatroom1){
            console.log("chatroom1", chatroom1);
            cb(err, chatroom1);
        });
    });
});

// ### Method: saveChatTab
userSchema.method('saveChatTab', function(userid, cb) {
    var user = this;
    var index = user.open_chats.indexOf(userid);

    if(index > -1) {
        user.open_chats.splice(index, 1);
        user.save(cb);
    } else {
        if(typeof cb === 'function'){
            cb(new Error('Chat already open for that userid'),null);    
        }
    }

});

// ### Method: saveChatTab
userSchema.method('removeChatTab', function(userid, cb) {
    var user = this;

    if(user.open_chats.indexOf(userid) === -1) {
        user.open_chats.push(userid);
        user.save(cb);
    } else {
        if(typeof cb === 'function'){
            cb(new Error('Chat already removed for that userid'),null);    
        }
    }

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
