var expect = require('chai').expect,
    should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');


describe("Follows", function(){
  describe("POST /follow", function() {
    it('Adds a new follow relationship...', function(done) {
      var folTest = {"from": "a", "to": "e"};
      api.post('/follow')
        .set('Accept', 'application/json')
        .send(folTest)
        .expect(200)
        .end(function(err, res) {
          console.log(folTest);
          done();
        });
    });
  });
});

describe("Listens", function() {
  describe("POST /listen", function() {
    it('Adds a new song as the user has just listened...', function(done) {
      var listTest = {"user": "a", "music": "m9"};
      api.post('/listen')
        .set('Accept', 'application/json')
        .send(listTest)
        .expect(200)
        .end(function(err, res) {
          console.log(listTest);
          expect(res.body).to.contain(listTest.music);
          done();
        });
    });
  });
});

describe("Recommendations", function() {
  describe("GET /recommendations", function() {
    var user = 'a';
    it('Should be an object', function(done) {
      api.get('/recommendations' + '?user=' + user)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          console.log(res.body);
          expect(res.body).should.be.an('object');
          done();
        });
      });
      it('Should give 5 recommendations', function(done) {
        api.get('/recommendations' + '?user=' + user)
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.keys('list');
            expect(res.body.list).to.deep.to.have.lengthOf(5);
            done();
          });
      });
  });
});
