const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  name: String,
  businessName: String,
  email: String,
  businessType: String,
  phone: String,
  annualTurnover: String,
  companyRegistration: String,
  bookkeeping: String,
  vatReturns: String,
  payroll: String,
  payslipsPerMonth: String,
  serviceDuration: String,
  quotePrice: String
});

module.exports = mongoose.model('Quote', QuoteSchema);
