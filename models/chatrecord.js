// ChatRecord Model
// -----------------------------

// Modules Dependencies:
//  - Mongoose (http://mongoosejs.com/docs/guide.html)
//  
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;

var chatrecordSchema = new Schema({
    name          : String,
    idFrom        : { type: Schema.Types.ObjectId, ref: 'User' },
    idTo          : { type: Schema.Types.ObjectId, ref: 'User' },
    message       : String,
    readed_status : { type: Boolean, default: false },
	created       : Date         
});

// ### Hooks 
// #### Pre-Save
chatrecordSchema.pre("save", function(next) {
    if(!this.created)
        this.created = new Date();
    next();
});

// ### Method:
chatrecordSchema.method("instanceMethod", function(param, cb) {
    var chatrecord = this;
    this.save(cb);
});

// ### Static:MarkAsRead
chatrecordSchema.statics.markAsRead = function (userid, msgid, cb) {
  var ChatRecord = this;
  ChatRecord.findOne({ idTo: userid, _id: msgid}, function(err, chatrecord){
      if(err) {
          cb(err, null);
      } else {
          if(chatrecord) {
              chatrecord.readed_status = true;
              chatrecord.save(cb);
          } else {
              cb(new Error('No record found with the specified parameters'), null);
          }
      }
  });
}

// Export module
module.exports = mongoose.model('ChatRecord', chatrecordSchema);
