//with help from:
//https://codeforgeek.com/2015/07/unit-testing-nodejs-application-using-mocha/
//http://willi.am/node-mocha-supertest/#32
//https://glebbahmutov.com/blog/how-to-correctly-unit-test-express-server/

var app = require("../app.js");
var supertest = require("supertest");
var agent = supertest.agent(app);

describe("[-] Server Test", function() {
  var server;
  var i;

  describe('> first pages', function(){
    it("returns home page", function (done) {
      agent
          .get("/")
          .expect(200)
          .expect(/.*Build Suspect Lineup.*/)
          .end(done);
    });
    it("returns resource not found", function (done) {
      agent
          .get("/no-resource")
          .expect(404)
          .end(done);
    });
    it("returns first mugshot", function (done) {
      agent
          .post("/get-suspects")
          .set("Content-Type", "application/x-www-form-urlencoded")
          .send({
            gender: "male", race: "asian", eye: "blue", hair: "bald"
          })
          .expect(/.*Mugshot 0.*/)
          .end(done);
    });
    it("returns next mugshot", function (done) {
      agent
          .post("/next-suspect")
          .expect(/.*Mugshot 1.*/)
          .end(done);
    });
  });

  // before(function () {
  //   server = app.listen(app.get('port'));
  // });
  // after(function () {
  //   server.close();
  // });

  describe('> returns end of lineup', function(){

    i = 0;
    var max_shots = 8;
    var noEnd = true;

    // beforeEach(function(){
    //   if (!noEnd){
    //     throw new Error("There is an End!");
    //   }
    // });

    function getNextMugShot(i){
      it('testing mugshot '+(i+2), function(done){
        agent
            .post("/next-suspect")
            .expect(function(i, max_shots, res) {
              var pattern = /.*End of Lineup.*/;

              if (pattern.test(res.text)) {
                noEnd = false;
              }
              else if (i == max_shots && noEnd) {
                throw new Error("No End")
              }
            }.bind(null, i, max_shots))
            .end(done);
      });
    }

    while (i < max_shots){
      i++;
      getNextMugShot(i);
    }

  });

  describe('> insufficient lineup', function(){
    var server;
    before(function(done){
      server = supertest(app);
      server
          .get('/make-database')
          .query('num_mugshots='+10)
          .end(function(){
            setTimeout(done, 50);
          });
    });
    after(function(done){
      server = supertest(app.listen(app.get('port')));
      server
          .get('/make-database')
          .query('num_mugshots='+1000)
          .end(function(){
            setTimeout(done, 500);
          });
    });
    it('returns insufficient lineup error', function(done){
      server
          .post('/get-suspects')
          .expect(/.*Insufficient.*/)
          .end(done);
    });
  });
});



