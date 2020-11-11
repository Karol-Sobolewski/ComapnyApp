const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const { expect } = chai;
const { request } = chai;

describe('PUT /api/departments', () => {
  before(async () => {  // eslint-disable-line
    const testDepOne = new Department({
      _id: '5d9f1140f10a81216cfd4408',
      name: 'Department #1',
    });
    await testDepOne.save();
  });

  it('/:id should update chosen document and return success', async () => {
    const res = await request(server)
      .put('/api/departments/5d9f1140f10a81216cfd4408')
      .send({ name: '#Department #3' });
    const updatedDepartment = await Department.findOne({
      _id: '5d9f1140f10a81216cfd4408',
    });

    expect(res.status).to.be.equal(200);
    expect(res.body).to.not.be.null; // eslint-disable-line
    expect(updatedDepartment.name).to.be.equal('#Department #3');
  });

  after(async () => {  // eslint-disable-line
    await Department.deleteMany();
  });
});
