import News from '../src/models/News';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';

chai.use(chaiHttp);

//Our parent block
describe('News', () => {
    beforeEach((done) => {
        //Before each test we empty the database
        News.deleteMany({}, () => {
            done();
        });
    });
    /*
     * Test the GET route
     */
    describe('GET /api/news', () => {
        it('it should get all the news', (done) => {
            chai.request(server)
                .get('/api/news')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
});
