// Sector Model
// -----------------------------

// Modules Dependencies:
//  - Mongoose (http://mongoosejs.com/docs/guide.html)
//  
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;

var sectorSchema = new Schema({
    name          : String, // i.e. Finance, HR, etc 
	created       : Date         
});

// ### Hooks 
// #### Pre-Save
sectorSchema.pre("save", function(next) {
    if(!this.created)
        this.created = new Date();
    next();
});

// ### Method:
sectorSchema.method("instanceMethod", function(param, cb) {
    var sector = this;
    this.save(cb);
});

// ### Static:
sectorSchema.statics.customMethod = function (paramid, cb) {
  var Sector = this;
  Sector.findOne({ _id: paramid}, function(err, sector){
      cb(err, sector);
  });
}

// Export module
module.exports = mongoose.model('Sector', sectorSchema);
