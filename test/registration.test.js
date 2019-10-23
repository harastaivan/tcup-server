import mongoose from 'mongoose';
import AccomodationType from '../src/models/AccomodationType';
import CompetitionClass from '../src/models/CompetitionClass';
import GliderType from '../src/models/GliderType';
import Region from '../src/models/Region';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
const should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Form data', () => {
    beforeEach(done => {
        //Before each test we empty the database
        AccomodationType.deleteMany({}, err => {
            done();
        });
    });
    beforeEach(done => {
        //Before each test we empty the database
        CompetitionClass.deleteMany({}, err => {
            done();
        });
    });
    beforeEach(done => {
        //Before each test we empty the database
        GliderType.deleteMany({}, err => {
            done();
        });
    });
    beforeEach(done => {
        //Before each test we empty the database
        Region.deleteMany({}, err => {
            done();
        });
    });
    /*
     * Test the GET route
     */
    describe('GET /api/registration/form', () => {
        it('it should get all form data for registration form', done => {
            chai.request(server)
                .get('/api/registration/form')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.accomodationTypes.should.be.a('array');
                    res.body.accomodationTypes.length.should.be.eql(0);
                    res.body.competitionClasses.should.be.a('array');
                    res.body.competitionClasses.length.should.be.eql(0);
                    res.body.gliderTypes.should.be.a('array');
                    res.body.gliderTypes.length.should.be.eql(0);
                    res.body.regions.should.be.a('array');
                    res.body.regions.length.should.be.eql(0);
                    done();
                });
        });
    });
});
