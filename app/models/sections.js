var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/

// set up a mongoose model
var SectionSchema = new Schema({
  sectionId: String,
  locationId:String,
  locationName:String,
  sectionName:String,
  tableName:String
});

SectionSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});
module.exports = mongoose.model('Section', SectionSchema);
