const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose')

describe('Employee', () => {

    it('should throw an error if no args', () => {
        const emp = new Employee({}); // create new Employee, but don't set attrs values
      
        emp.validate(err => {
          expect(err.errors.firstName).to.exist;
          expect(err.errors.lastName).to.exist;
          expect(err.errors.department).to.exist;
        });  
      });

      it('should throw an error if args are not strings', () => {
        const cases = [{}, []];
        for(let name of cases) {
          const dep = new Employee({ firstName: name, lastName: name, department: name });
      
          dep.validate(err => {
            expect(err.errors.firstName).to.exist;
            expect(err.errors.lastName).to.exist;
            expect(err.errors.department).to.exist;
          });
      
        }
      });

    it('should not throw an error if data are ok', () => {
        const firstName = 'firstName';
        const lastName = 'lastName'
        const department = 'department'
        const emp = new Employee({firstName, lastName, department});
      
        emp.validate(err => {
          expect(err).to.not.exist;
        });
      
      });
  });
  after(() => {
    mongoose.models = {};
  });