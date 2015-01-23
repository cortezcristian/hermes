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

// ### Static:
chatrecordSchema.statics.customMethod = function (paramid, cb) {
  var ChatRecord = this;
  ChatRecord.findOne({ _id: paramid}, function(err, chatrecord){
      cb(err, chatrecord);
  });
}

// Export module
module.exports = mongoose.model('ChatRecord', chatrecordSchema);
