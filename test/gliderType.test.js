import GliderType from '../src/models/GliderType';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';

chai.use(chaiHttp);

//Our parent block
describe('GliderType', () => {
    beforeEach(done => {
        //Before each test we empty the database
        GliderType.deleteMany({}, () => {
            done();
        });
    });
    /*
     * Test the GET route
     */
    describe('GET /api/glidertypes', () => {
        it('it should get all the glider types', done => {
            chai.request(server)
                .get('/api/glidertypes')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
});
