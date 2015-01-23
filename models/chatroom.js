// ChatRoom Model
// -----------------------------

// Modules Dependencies:
//  - Mongoose (http://mongoosejs.com/docs/guide.html)
//  
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;

var chatroomSchema = new Schema({
    name          : String, 
	created       : Date         
});

// ### Hooks 
// #### Pre-Save
chatroomSchema.pre("save", function(next) {
    if(!this.created)
        this.created = new Date();
    next();
});

// ### Method:
chatroomSchema.method("instanceMethod", function(param, cb) {
    var chatroom = this;
    this.save(cb);
});

// ### Static:
chatroomSchema.statics.customMethod = function (paramid, cb) {
  var ChatRoom = this;
  ChatRoom.findOne({ _id: paramid}, function(err, chatroom){
      cb(err, chatroom);
  });
}

// Export module
module.exports = mongoose.model('ChatRoom', chatroomSchema);
