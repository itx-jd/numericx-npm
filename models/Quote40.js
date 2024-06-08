const mongoose = require('mongoose');

const Quote40Schema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  name: String,
  email: String,
  phone: String,
  businessType: String,
  dormant: String,
  nonTrading: String,
  freeCompanyFormation: String,
  annualTurnover: String,
  vatReturns: String,
  payrollSelect: String,
  numberOfEmployees: String,
  pensionScheme: String,
  numberOfEmployeesEnrolled: String,
  bookkeeping: String,
  numberOfTransactions: String,
  quotePrice: String
});

module.exports = mongoose.model('Quote40', Quote40Schema);
