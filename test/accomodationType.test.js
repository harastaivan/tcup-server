import AccomodationType from '../src/models/AccomodationType';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';

const should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('AccomodationType', () => {
    beforeEach((done) => {
        //Before each test we empty the database
        AccomodationType.deleteMany({}, () => {
            done();
        });
    });
    /*
     * Test the GET route
     */
    describe('GET /api/accomodationtypes', () => {
        it('it should get all the accomodation types', (done) => {
            chai.request(server)
                .get('/api/accomodationtypes')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
});
