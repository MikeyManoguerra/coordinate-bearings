const mongoose = require('mongoose');

const bearingSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bearing', required: true },
  xCoordinate: { type: Number, required: true },
  yCoordinate: { type: Number, required: true },
  dataSetId: { type: mongoose.Schema.Types.ObjectId, ref: 'DataSet', required: true },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bearing' },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  bearingValue : { type: Number },  // from parent, in relation to north?
});
// Add `createdAt` and `updatedAt` fields
bearingSchema.set('timestamps', true);


bearingSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v;
  }
});
module.exports = mongoose.model('Bearing', bearingSchema);

