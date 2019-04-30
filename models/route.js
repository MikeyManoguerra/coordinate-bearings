const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  leftBound: { type: Number },
  rightBound: { type: Number },
  description: { type: String },
  dataSetId: { type: mongoose.Schema.Types.ObjectId, ref: 'DataSet', required: true },
});
// Add `createdAt` and `updatedAt` fields
routeSchema.set('timestamps', true);


routeSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v;
  }
});
module.exports = mongoose.model('Route', routeSchema);

