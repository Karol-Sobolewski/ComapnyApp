const Department = require('../models/department.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Department.find({}));
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const dep = await Department.findOne().skip(rand);
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.addNew = async (req, res) => {
  try {
    // ?czemu tutaj {name} jest w try a w put poza

    const { name } = req.body;
    const newDepartment = new Department({ name });
    await newDepartment.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.modify = async (req, res) => {
  const { name } = req.body;

  try {
    // ?czemu dep.find jest w ()

    const dep = await Department.findById(req.params.id);
    if (dep) {
      dep.name = name;
      await dep.save();
      res.json(dep);
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.remove = async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (dep) {
      // await dep.deleteOne({_id: req.params.id}); //? może być tak?
      await dep.deleteOne();
      res.json(dep);
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
