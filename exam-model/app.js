const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/companyDB';

// Employee schema
const Employee = mongoose.model('Employee', new mongoose.Schema({
  employeeId: Number,
  name: String,
  department: String,
  designation: String,
  salary: Number,
  email: String
}));

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    if ((await Employee.countDocuments()) === 0) {
      await Employee.insertMany([
        { employeeId: 101, name: 'Arun', department: 'IT', designation: 'Developer', salary: 50000, email: 'arun@gmail.com' },
        { employeeId: 102, name: 'Priya', department: 'HR', designation: 'Manager', salary: 60000, email: 'priya@gmail.com' }
      ]);
    }
  })
  .catch(err => console.log('MongoDB error:', err.message));

// 1. Search employee using employeeId
app.get('/search/:id', async (req, res) => {
  const emp = await Employee.findOne({ employeeId: req.params.id });
  if (!emp) return res.send('Employee not found');
  res.json(emp);
});

// 2. Update salary using employeeId
app.put('/update/:id', async (req, res) => {
  const emp = await Employee.findOneAndUpdate(
    { employeeId: req.params.id },
    { salary: req.body.salary },
    { new: true }
  );
  if (!emp) return res.send('Employee not found');
  res.json(emp);
});

app.listen(PORT, '0.0.0.0', () => console.log('Server running on port ' + PORT));
