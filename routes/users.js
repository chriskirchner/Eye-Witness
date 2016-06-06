//intended for user routes

var express = require('express');
var router = express.Router();
var db = require('../database/db.js');
var rt = require('../modules/rand_tools.js');
var st = require('../modules/session_tools.js');

MAX_DATABASE=1000;

//home page
router.get('/', function(req, res){
    //first page directs cop to input suspect traits
    var context = {};
    res.render('input-suspect-page', context);
});

//generate lineup based on suspect traits from POST request
router.post('/get-suspects', function(req, res){
  
  //get random number of mugshots for lineup
  var min_mugshots = 6;
  var max_mugshots = 9;
  var num_mugshots = rt.randRange(min_mugshots, max_mugshots);

  //account for suspect addition to lineup
  num_mugshots -= 1;

  //already tested random query
  //https://www.warpconduit.net/2011/03/23/selecting-a-random-record-using-mysql-benchmark-results/
  query = "SELECT * FROM profiles WHERE gender=? and race=? and " +
      "eye_color=? and hair_color=? " +
      "ORDER BY RAND() LIMIT ?";
  values = [req.body['gender'], req.body['race'],
    req.body['eye'], req.body['hair'], num_mugshots];

  //grab random lineup of matching traits
  db.query(query, values, function(err, rows, fields){
    var lineup = JSON.parse(JSON.stringify(rows));

    //determine if there are enough mugshots to make lineup
    if (rows.length < num_mugshots){
      req.session['valid_mugshot_count'] = false;
    }
    else {
      req.session['valid_mugshot_count'] = true;
    }

    //add suspect to lineup
    st.addSuspectToLineup(req, lineup, MAX_DATABASE);
    //add lineup to session
    st.addLineupToSession(lineup, req.session);
    res.render('output-suspect-pages', req.session);
  });
  
});

//resource for next suspect (mugshot) in lineup
router.post('/next-suspect', function(req, res){
    req.session['index'] += 1;
    req.session['traits'] = req.session['profiles'][req.session['index']];
    if (req.session['index'] < req.session['max_index']){
        //show next suspect
        res.render('output-suspect-pages', req.session);
    }
    else {
        //end of lineup
        var context = {};
        context.result = "No suspect was identified.";
        res.render('end-of-lineup', context);
    }
});

//show the choose suspect page
router.post('/choose-suspect', function(req, res){
  var context = {};
  if (req.session['traits'].id == req.session['suspect'].id){
    //cop's suspect is chosen
    context.result = "You identified the suspect!"
  }
  else {
    //cop's suspect was not chosen
    context.result = "You did not choose the cop's suspect";
  }
  res.render('end-of-lineup', context);
});

module.exports = router;
