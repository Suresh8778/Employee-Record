const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  department: { type: String, required: true },
  jobTitle: { type: String, required: true },
  hireDate: { type: Date, required: true },
  employmentType: { type: String, required: true },
  employeeStatus: { type: String, required: true },
  manager: { type: String },
  salary: { type: Number, required: true },
  payFrequency: { type: String },
  bankAccount: { type: String, required: true, match: /^[0-9]{12}$/ },  
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

module.exports = mongoose.model('Employee', employeeSchema);
