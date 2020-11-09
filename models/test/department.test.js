const { expect } = require('chai');
const mongoose = require('mongoose');
const Department = require('../department.model.js');

describe('Department', () => {
  it('should throw an error if no "name" arg', () => {
    const dep = new Department({}); // create new Department, but don't set `name` attr value

    dep.validate(err => {
      expect(err.errors.name).to.exist;
    });
  });
  it('should throw an error if "name" is not a string', () => {
    const cases = [{}, []];
    for (const name of cases) {
      const dep = new Department({ name });

      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });
  it('should throw an error if "name" is shorter than 5 signs and longer than 20', () => {
    const cases = ['Lore', 'LoremIpsumLoremIpsumLoremIpsumLoremIpsum'];
    for (const name of cases) {
      const dep = new Department({ name });
      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });
  it('should not throw an error if name is ok', () => {
    const name = 'Lorem';
    const dep = new Department({ name });
    dep.validate(err => {
      expect(err).to.not.exist;
    });
  });
});
