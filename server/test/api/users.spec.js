import supertest from 'supertest';
import { assert } from 'chai';
import app from '../../server';
import '../../models/index';
import helper from '../helpers/Helper';

const server = supertest.agent(app);
let jwtToken;

describe('Users', () => {
  it('Should be able to sign up', (done) => {
    server
      .post('/users')
      .send(helper.newUser)
      .expect(200)
      .end((err, res) => {
        assert.equal(res.status, 201);
        assert.isNotNull(res.body.token);
        done();
      });
  });

  it('Should return a message when user tries to sign up with an exisitig email', (done) => {
    server
      .post('/users')
      .send(helper.existingEmail)
      .end((err, res) => {
        assert.equal(res.status, 409);
        assert.equal(res.body.message, 'There is a user with this email: barbara@gmail.com');
        done();
      });
  });

  it('Should return 400 status when user tries to signup without firstname or lastname ', (done) => {
    server
      .post('/users')
      .send(helper.newUserWithlastName)
      .end((err, res) => {
        assert.equal(res.status, 400);
        done();
      });
  });

  it('Should return a token when user logs in ', (done) => {
    server
      .post('/users/login')
      .send({ email: 'akinrelesimi@gmail.com', password: 'password' })
      .expect(200)
      .end((err, res) => {
        assert.isNotNull(res.body.token);
        done();
      });
  });

  it('Should return error message when user tries to login in with invalid details ', (done) => {
    server
      .post('/users/login')
      .send({ email: 'akinrelesimi@gmail.com', password: 'pass' })
      .end((err, res) => {
        assert.equal(res.body.message, 'Invalid username or password');
        done();
      });
  });

  it('Should return error message when user tries to login in with invalid details ', (done) => {
    server
      .post('/users/login')
      .send({ email: 'yemi@gmail.com', password: 'password' })
      .end((err, res) => {
        assert.equal(res.status, 404);
        done();
      });
  });

  it('Should return message when a user logs out', (done) => {
    server
      .post('/users/logout')
      .end((err, res) => {
        assert.equal(res.body.message, 'Successfully logged out.');
        done();
      });
  });

  describe('Access with token', () => {
    before((done) => {
      server
      .post('/users/login')
      .send({ email: 'akinrelesimi@gmail.com', password: 'password' })
      .end((err, res) => {
        jwtToken = res.body.token;
        done();
      });
    });

    it('Should return success when a users information is edited', (done) => {
      server
      .put('/users/3')
      .set('X-ACCESS-TOKEN', jwtToken)
      .send({ firstname: 'Bolarinwa' })
      .end((err, res) => {
        assert.isNotNull(res.body);
        done();
      });
    });

    it('Should return users document with a particular userId', (done) => {
      server
      .get('/users/3/documents')
      .set('X-ACCESS-TOKEN', jwtToken)
      .end((err, res) => {
        assert.isNotNull(res.body);
        done();
      });
    });

    it('Should be able to udpate password', (done) => {
      server
      .put('/users/3/password')
      .set('X-ACCESS-TOKEN', jwtToken)
      .send({ oldPassword: 'password', newPassword: 'simisola' })
      .end((err, res) => {
        assert.isNotNull(res.body);
        done();
      });
    });

    it('Should be able to udpate password', (done) => {
      server
      .put('/users/1/password')
      .set('X-ACCESS-TOKEN', jwtToken)
      .send({ oldPassword: 'simisola', newPassword: 'simisola' })
      .end((err, res) => {
        assert.equal(res.status, 400);
        assert.equal(res.body.message, 'Incorrect Password');
        done();
      });
    });

    it('Should return status 200 when a user has been deleted', (done) => {
      server
      .delete('/users/3')
      .expect(200)
      .set('X-ACCESS-TOKEN', jwtToken)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Delete successful');
        done();
      });
    });

    it('Should return users information if user exist', (done) => {
      server
      .get('/users/1')
      .expect(200)
      .set('X-ACCESS-TOKEN', jwtToken)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isNotNull(res.body);
        done();
      });
    });

    it('Should return users information when searched using the users email', (done) => {
      server
      .get('/users/search/barbara@gmail.com')
      .set('X-ACCESS-TOKEN', jwtToken)
      .expect(200)
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
    });

    it('Should return users if found', (done) => {
      server
      .get('/search/users/?q=simi')
      .set('X-ACCESS-TOKEN', jwtToken)
      .expect(200)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isNotNull(res.body);
        done();
      });
    });

    it('Should verify if user is logged in before fetching documents', (done) => {
      server
      .get('/users/documents')
      .end((err, res) => {
        assert.equal(res.status, 401);
        assert.equal(res.body.message, 'Authentication required to access this route!');
        done();
      });
    });

    it('Should fetch users document', (done) => {
      server
      .get('/users/documents?offset=5&limit=2&order=DESC')
      .set('X-ACCESS-TOKEN', jwtToken)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isNotNull(res.body);
        done();
      });
    });

    it('Should validate offset, limit before getting document', (done) => {
      server
      .get('/users/documents?limit=c&offset=c&order=ASC')
      .set('X-ACCESS-TOKEN', jwtToken)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isNotNull(res.body);
        done();
      });
    });

    it('Should return error message when search for a user with invalid email', (done) => {
      server
      .get('/users/search/seye@gmail.com')
      .set('X-ACCESS-TOKEN', jwtToken)
      .end((err, res) => {
        assert.equal(res.status, 400);
        done();
      });
    });

    it('Should return invalid user if user does not exist', (done) => {
      server
      .get('/users/500')
      .expect(200)
      .set('X-ACCESS-TOKEN', jwtToken)
      .end((err, res) => {
        assert.equal(res.status, 404);
        assert.equal(res.body.message, 'User does not exist');
        done();
      });
    });

    it('Should get all users', (done) => {
      server
      .get('/users')
      .expect(200)
      .set('X-ACCESS-TOKEN', jwtToken)
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
    });
  });
});
