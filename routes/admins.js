//intended for admin use and testing

var express = require('express');
var router = require('./users.js');
var db = require('../database/db.js');
var rt = require('../modules/rand_tools.js');
var st = require('../modules/session_tools.js');

//route for requesting a database regeneration
//fills database with random profiles based on a query url
router.get('/make-database', function(req, res, next){
  var num_mugshots = req.query['num_mugshots'];
  //drop table if it exists
  db.query("DROP TABLE IF EXISTS profiles", function(err){
    var create_query = "CREATE TABLE profiles (" +
        "id INT AUTO_INCREMENT, " +
        "gender VARCHAR(255) NOT NULL, " +
        "race VARCHAR(255) NOT NULL, " +
        "eye_color VARCHAR(255) NOT NULL, " +
        "hair_color VARCHAR(255) NOT NULL, " +
        "PRIMARY KEY (id)) " +
        "ENGINE=InnoDB DEFAULT CHARSET=latin1";
    db.query(create_query, function(err) {

      if (err) {
        next(err);
        return;
      }

      //generate list of traits to choose form
      var gender = ['male', 'female'];
      var race = ['asian', 'black', 'white'];
      var eye = ['blue', 'green', 'brown'];
      var hair = ['bald', 'black', 'blond', 'brown', 'red'];

      //show database regeneration page
      var context = {};
      context.num_mugshots = num_mugshots;
      res.render('database', context);

      for (i = 0; i < num_mugshots; i++) {

        //choose random traits for each profile
        gender_index = rt.randRange(0, gender.length-1);
        race_index = rt.randRange(0, race.length-1);
        eye_index = rt.randRange(0, eye.length-1);
        hair_index = rt.randRange(0, hair.length-1);

        //insert random profile into database
        query = "INSERT INTO profiles (gender, race, eye_color, hair_color) " +
            "VALUES (?, ?, ?, ?)";
        values = [gender[gender_index], race[race_index],
          eye[eye_index], hair[hair_index]];

        db.query(query, values, function (err, rows, fields) {
          if (err) {
            next(err);
            return;
          }
        });
      }
    });
  });
});

module.exports = router;
