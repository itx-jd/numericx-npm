const mongoose = require('mongoose');

const PopupSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  name: String,
  email: String,
  phone: String,
  serviceType: String,
  message: String
});

module.exports = mongoose.model('Popup', PopupSchema);
