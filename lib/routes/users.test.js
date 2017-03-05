'use strict';

var expect = require('chai').expect
  , sinon = require('sinon')
  , supertest = require('supertest')
  , proxyquire = require('proxyquire');

describe(__filename, function () {
  var request
    , getStub
    , updateStub
    , writeStub
    , stubs
    , app
    , USERS = '../users'
    , dummyUser = {
      firstname: 'jane',
      lastname: 'doe'
    };

  beforeEach(function () {
    getStub = sinon.stub();
    updateStub = sinon.stub();
    writeStub = sinon.stub();

    // Our stubs map for the module we're requiring
    stubs = {};

    // Add a stub for our users module
    stubs[USERS] = {
      getUser: getStub,
      writeUser: writeStub,
      updateById: updateStub
    };

    // Create a new express application for each test case
    app = require('express')();

    // app.set('env', 'test');

    // Initialise our express app with our router
    proxyquire('./users.js', stubs)(app);

    // Initialise a supertest instance with our application
    request = supertest(app);
  });


  it('should load successfully and export function', function () {
    var mod = require('./users.js');
    expect(mod).to.be.a('function');
  });


  describe('GET /users/:id', function () {
    it('should get 200 plus a user object', function (done) {
      getStub.yields(null, dummyUser);

      request
        .get('/users/0')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('firstname');
          expect(res.body).to.have.property('lastname');
          done();
        });
    });

    it('should get 404 with status message', function (done) {
      getStub.yields(null, null);

      request
        .get('/users/50')
        .expect(404)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status');
          done();
        });
    });

    it('should get 500 error', function (done) {
      getStub.yields(new Error('oh noes \(o.o)/'), null);

      request
        .get('/users/0')
        .expect(500)
        .end(done);
    });
  });

  describe('POST /users/:id', function () {
    it('should get 200 plus a new user', function (done) {
      writeStub.yields(null, dummyUser);

      request
        .post('/users/0')
        .send(dummyUser)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('firstname');
          expect(res.body).to.have.property('lastname');
          done();
        });
    });

    it('should get 500 error', function (done) {
      writeStub.yields(new Error('failed to write'), null);

      request
        .post('/users/0')
        .expect(500)
        .end(done);
    });
  });


  describe('PUT /users/:id', function () {
    it('should get 200 plus a new updated user object', function (done) {
      updateStub.callsArgWith(2, null, dummyUser);

      request
        .put('/users/0')
        .send(dummyUser)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('firstname');
          expect(res.body).to.have.property('lastname');
          done();
        });
    });

    it('should get 404 with status message', function (done) {
      updateStub.callsArgWith(2, null, null);

      request
        .put('/users/50')
        .send({})
        .expect(404)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status');
          done();
        });
    });

    it('should get 500 error', function (done) {
      updateStub.callsArgWith(2, new Error('oh noes \(o.o)/'), null);

      request
        .put('/users/0')
        .expect(500)
        .end(done);
    });
  });
});
