const mongoose = require('mongoose');

const Quote100Schema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  name: String,
  email: String,
  phone: String,
  businessType: String,
  dormant: String,
  nonTrading: String,
  freeCompanyFormation: String,
  numberOfPartners: String,
  annualTurnover: String,
  vatReturns: String,
  payrollSelect: String,
  numberOfEmployees: String,
  pensionScheme: String,
  numberOfEmployeesEnrolling: String,
  bookkeeping: String,
  numberOfTransactions: String,
  quotePrice: String
});

module.exports = mongoose.model('Quote100', Quote100Schema);
