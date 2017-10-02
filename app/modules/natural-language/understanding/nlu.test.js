//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let Nlu = require('./nlu');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Nlu', () => {
    beforeEach((done) => { //Before each test we empty the database

    });
    /*
      * Test the /GET route
      */
    describe('parse sentence', () => {
        it('it should parse the data and return semantic roles of parts of the sentences', (done) => {
            chai.request(server)
                .get('/book')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

});