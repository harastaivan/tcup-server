import Region from '../src/models/Region';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';

chai.use(chaiHttp);

//Our parent block
describe('Region', () => {
    beforeEach(done => {
        //Before each test we empty the database
        Region.deleteMany({}, () => {
            done();
        });
    });
    /*
     * Test the GET route
     */
    describe('GET /api/regions', () => {
        it('it should get all the regions', done => {
            chai.request(server)
                .get('/api/regions')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
});
