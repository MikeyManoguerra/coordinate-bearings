const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  xCoordinate: { type: Number, required: true },
  yCoordinate: { type: Number, required: true },
  dataSetId: { type: mongoose.Schema.Types.ObjectId, ref: 'DataSet', required: true },

});
// Add `createdAt` and `updatedAt` fields
pointSchema.set('timestamps', true);


pointSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v;
  }
});
const Point = mongoose.model('Point', pointSchema);
module.exports = { Point }

