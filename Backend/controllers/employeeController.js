const Employee = require("../models/employeeModel");

exports.createEmployee = async (req, res) => {
  try {
    if (req.body._id) {
      delete req.body._id;
    }

    const newEmployee = new Employee(req.body);
    const saved = await newEmployee.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ error: err.message });
  }
};

// All Employee
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees" });
  }
};

// Update
exports.updateEmployee = async (req, res) => {
  console.log("Update request received:", req.params.id);
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ error: "Failed to delete employee" });
  }
};

exports.deleteMultipleEmployees = async (req, res) => {
  const ids = req.body.ids;
  try {
    await Employee.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Employees deleted successfully" });
  } catch (err) {
    console.error("Error deleting employees:", err);
    res.status(500).json({ error: "Failed to delete employees" });
  }
};
