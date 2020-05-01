var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/

// set up a mongoose model
var LocationSchema = new Schema({
  locationId: String,
  locationName:String,
  sectionName:Schema.Types.Mixed,
  orderId:Schema.Types.Mixed
});

LocationSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});
module.exports = mongoose.model('Location', LocationSchema);
