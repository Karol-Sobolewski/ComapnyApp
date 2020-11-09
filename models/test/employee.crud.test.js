const { expect } = require('chai');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Department = require('../department.model.js');
const Employee = require('../employee.model');

describe('Employee', () => {
  describe('Reading data', () => {
    before(async () => {
      const testDepOne = new Department({ name: 'Department #3' });
      await testDepOne.save();

      const department = await Department.findOne({ name: 'Department #3' });

      const testEmpOne = new Employee({
        firstName: 'John',
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
      const employees = await Employee.find().populate('department');
      expect(employees.length).to.be.equal(2);
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const employeeOne = await Employee.findOne({ firstName: 'John' });
      const employeeTwo = await Employee.findOne({ lastName: 'Doe' });

      expect(employeeOne).to.not.be.null;
      expect(employeeTwo).to.not.be.null;
    });

    it('should contain objects in "department" field', async () => {
      const employees = await Employee.find().populate('department');
      employees.forEach(employee => {
        expect(employee.department).to.be.a('Object');
      });
    });

    it('should return populated department with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John' }).populate(
        'department'
      );

      expect(employee.department).to.not.be.null;
      expect(employee.department.name).to.be.equal('Department #3');
    });

    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({
        firstName: 'John',
        lastName: 'Public',
        department: '4',
      });
      await employee.save();

      expect(employee.isNew).to.be.false;
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: '5',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Jane',
        lastName: 'Doe',
        department: '4',
      });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        { lastName: 'Doe' },
        { $set: { lastName: 'Doe2' } }
      );
      const updatedEmployee = await Employee.findOne({ lastName: 'Doe2' });

      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ lastName: 'Doe' });
      employee.lastName = 'Doe2';
      await employee.save();

      const updatedEmployee = await Employee.findOne({ lastName: 'Doe2' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { lastName: 'Doe2' } });
      const updatedEmployees = await Employee.find({ lastName: 'Doe2' });

      expect(updatedEmployees.length).to.be.equal(2);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Removing data', async () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: '5',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Jane',
        lastName: 'Doe2',
        department: '4',
      });
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ lastName: 'Doe' });

      const deletedEmployee = await Employee.findOne({ lastName: 'Doe' });
      expect(deletedEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ lastName: 'Doe2' });
      await employee.remove();

      const deletedEmployee = await Employee.findOne({ lastName: 'Doe2' });
      expect(deletedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();

      const employee = await Employee.find();
      expect(employee.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
});
