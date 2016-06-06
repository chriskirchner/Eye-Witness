/**
 * Created by ev on 6/3/16.
 */

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

//system under test, SUT
describe('Array <>', function(){
  it('test to test the testing framework is working', function(){
    var arr = [];
    assert.equal(arr.length, 0);
  });
});

var rt = require('../modules/rand_tools.js');

describe('[-] Random Tools', function(){
  //tests range between min and max, inclusive
  describe('> Random Range', function(){
    it('show one number when min and max are equal', function(){
      assert.equal(rt.randRange(1,1), 1);
    });
    it('show range 1-2 is inclusive out of 10 tries', function(){
      for (i=0; i<10; i++){
        expect(rt.randRange(1,2)).to.be.within(1,2);
      }
    });
  });
  describe('> Random ID', function(){
    it('returns null when no ids available', function(){
      not_these = [{'id':1},{'id':2}, {'id':3}];
      assert.equal(rt.randID(not_these, 3), null);
    });
    it('returns only available id', function(){
      not_these = [{'id': 1}, {'id': 3}];
      assert.equal(rt.randID(not_these, 3), 2);
    });
  });
});

var st = require('../modules/session_tools.js');

describe('[-] Session Tools', function(){

  describe('> Add Suspect to Lineup', function(){
    it('add suspect to Empty Lineup', function(){
      var request = {};
      request.body = { gender: 'male', race: 'asian', eye: 'blue',
        hair: 'bald', id: 800 };
      request.session =  {};
      var lineup = [];
      st.addSuspectToLineup(request, lineup, 1);
      assert.equal(request.session['suspect'], lineup[0]);
    });
    it('add suspect to non-empty lineup (match object)', function(){
      var request = {};
      request.body = { gender: 'male', race: 'asian', eye: 'blue',
        hair: 'bald', id: 800 };
      request.session = {};
      lineup = [{ gender: 'female', race: 'black', eye: 'brown',
        hair: 'blond', id: 1 }];
      st.addSuspectToLineup(request, lineup, 2);
      expect(lineup).to.include(request.body);
    });
    it('add suspect to non-empty lineup (match count)', function(){
      var request = {};
      request.body = { gender: 'male', race: 'asian', eye: 'blue',
        hair: 'bald', id: 800 };
      request.session = {};
      lineup = [{ gender: 'female', race: 'black', eye: 'brown',
        hair: 'blond', id: 1 }];
      st.addSuspectToLineup(request, lineup, 2);
      assert.equal(lineup.length, 2);
    });
  });
  describe('Add Lineup to Session', function(){
    it('add lineup to empty session', function(){
      lineup = [{ gender: 'female', race: 'black', eye: 'brown',
        hair: 'blond', id: 1 }];
      session = {};
      st.addLineupToSession(lineup, session);
      expect(session['profiles']).to.include(lineup[0]);
    });
    it('add lineup to representative session', function(){
      lineup = [{ gender: 'female', race: 'black', eye: 'brown',
        hair: 'blond', id: 1 }];
      session = {cookie:
        { path: '/',
            _expires: null,
            originalMaxAge: null,
            httpOnly: true },
        suspect:
        { gender: 'male',
            race: 'asian',
            eye: 'blue',
            hair: 'bald',
            id: 100 } };
      st.addLineupToSession(lineup, session);
      expect(session['profiles']).to.include(lineup[0]);
    });
  });
});



