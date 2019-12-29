import User from '../src/models/User';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';

chai.use(chaiHttp);

//Our parent block
describe('User', () => {
    beforeEach((done) => {
        //Before each test we empty the database
        User.deleteMany({}, () => {
            done();
        });
    });
    /*
     * Test the GET route
     */
    describe('POST /api/users', () => {
        const user = {
            name: 'Test first name',
            surname: 'Test last name',
            email: 'test@example.com',
            password: '123456789'
        };
        it('it should create a user', (done) => {
            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('id');
                    res.body.user.should.have.property('name');
                    res.body.user.should.have.property('surname');
                    res.body.user.should.have.property('email');
                    res.body.user.should.have.property('admin');
                    res.body.user.should.not.have.property('password');
                    done();
                });
        });
    });
});
