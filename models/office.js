// Office Model
// -----------------------------

// Modules Dependencies:
//  - Mongoose (http://mongoosejs.com/docs/guide.html)
//  
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;

var officeSchema = new Schema({
    name          : String, //Branch name 
    location      : String, // City
	created       : Date         
});

// ### Hooks 
// #### Pre-Save
officeSchema.pre("save", function(next) {
    if(!this.created)
        this.created = new Date();
    next();
});

// ### Method:
officeSchema.method("instanceMethod", function(param, cb) {
    var office = this;
    this.save(cb);
});

// ### Static:
officeSchema.statics.customMethod = function (paramid, cb) {
  var Office = this;
  Office.findOne({ _id: paramid}, function(err, office){
      cb(err, office);
  });
}

// Export module
module.exports = mongoose.model('Office', officeSchema);
