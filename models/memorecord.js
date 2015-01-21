// MemoRecord Model
// -----------------------------

// Modules Dependencies:
//  - Mongoose (http://mongoosejs.com/docs/guide.html)
//  
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;

var memorecordSchema = new Schema({
    name          : String, 
    idFrom        : { type: Schema.Types.ObjectId, ref: 'User' },
    idTo          : { type: Schema.Types.ObjectId, ref: 'User' },
    idMemo        : { type: Schema.Types.ObjectId, ref: 'Memo' },
    readed_status : { type: Boolean, default: false },
	created       : Date         
});

// ### Hooks 
// #### Pre-Save
memorecordSchema.pre("save", function(next) {
    if(!this.created)
        this.created = new Date();
    next();
});

// ### Method:
memorecordSchema.method("instanceMethod", function(param, cb) {
    var memorecord = this;
    this.save(cb);
});

// ### Static:
memorecordSchema.statics.customMethod = function (paramid, cb) {
  var MemoRecord = this;
  MemoRecord.findOne({ _id: paramid}, function(err, memorecord){
      cb(err, memorecord);
  });
}

// Export module
module.exports = mongoose.model('MemoRecord', memorecordSchema);
