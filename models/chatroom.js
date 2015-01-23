// ChatRoom Model
// -----------------------------

// Modules Dependencies:
//  - Mongoose (http://mongoosejs.com/docs/guide.html)
//  
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;

var enumModes = ['private', 'group'];

var chatroomSchema = new Schema({
    name          : String,
    allowedUsers  : [{ type: Schema.Types.ObjectId, ref: 'User' }],
    history       : [{ type: Schema.Types.ObjectId, ref: 'ChatRecord' }],
    mode          : { type: String, enum: enumModes, default: 'private' },
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
// ### Static: findOrCreate
chatroomSchema.statics.findOrCreate = function (userfrom, userto, cb) {
  var ChatRoom = this;
  var regpattern1 = userfrom+userto;
  var regpattern2 = userto+userfrom;
  var search =  { $or:[ {'name': regpattern1 }, {'name': regpattern2 } ]}
  ChatRoom.findOne(search, function(err, chatroom){
      if(err){
        cb(err, null);
      }else{
          if(chatroom) {
            cb(null, chatroom)    
          } else {
            var c = new ChatRoom({
                name: regpattern1    
            });
            // TODO: add allowedUsers
            c.save(cb);
          }
      }
  });
}

// Export module
module.exports = mongoose.model('ChatRoom', chatroomSchema);
