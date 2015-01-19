// Memo Model
// -----------------------------

// Modules Dependencies:
//  - Mongoose (http://mongoosejs.com/docs/guide.html)
//  
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;

var memoSchema = new Schema({
    name          : String, 
	created       : Date         
});

// ### Hooks 
// #### Pre-Save
memoSchema.pre("save", function(next) {
    if(!this.created)
        this.created = new Date();
    next();
});

// ### Method:
memoSchema.method("instanceMethod", function(param, cb) {
    var memo = this;
    this.save(cb);
});

// ### Static:
memoSchema.statics.customMethod = function (paramid, cb) {
  var Memo = this;
  Memo.findOne({ _id: paramid}, function(err, memo){
      cb(err, memo);
  });
}

// Export module
module.exports = mongoose.model('Memo', memoSchema);
