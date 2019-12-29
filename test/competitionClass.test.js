import CompetitionClass from '../src/models/CompetitionClass';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';

chai.use(chaiHttp);

//Our parent block
describe('CompetitionClass', () => {
    beforeEach(done => {
        //Before each test we empty the database
        CompetitionClass.deleteMany({}, () => {
            done();
        });
    });
    /*
     * Test the GET route
     */
    describe('GET /api/classes', () => {
        it('it should get all the competition classes', done => {
            chai.request(server)
                .get('/api/classes')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
});
