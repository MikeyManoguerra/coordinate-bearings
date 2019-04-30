const mongoose = require('mongoose');

const dataSetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
});
// Add `createdAt` and `updatedAt` fields
dataSetSchema.set('timestamps', true);


dataSetSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v;
  }
});
let DataSet = mongoose.model('DataSet', dataSetSchema);
module.exports = { DataSet }

