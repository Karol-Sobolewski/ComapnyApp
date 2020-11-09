const { expect } = require('chai');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Department = require('../department.model.js');
const Employee = require('../employee.model');

describe('Employee', () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();

      const uri = await fakeDB.getUri();

      mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.log(err);
    }
  });
  describe('Reading data', () => {
    before(async () => {
      const testDepOne = new Department({ name: 'Department #3' });
      await testDepOne.save();

      const department = await Department.findOne({ name: 'Department #3' });

      const testEmpOne = new Employee({
        firstName: 'Joe',
        lastName: 'Doe',
        department: department.id,
      });
      await testEmpOne.save();
      const testEmpTwo = new Employee({
        firstName: 'Jane',
        lastName: 'Doe',
        department: department.id,
      });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });
});
