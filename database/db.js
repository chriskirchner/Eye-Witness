//setup database as module
var mysql = require('mysql');
var pool;

//got help on how to setup mysql module for node js:
//https://codereview.stackexchange.com/questions/120331/passing-node-js-sql-connection-to-multiple-routes
function createPool(){

  if (!pool){
    pool = mysql.createPool({
      host: "localhost",
      user: "student",
      password: "default",
      database: "mugshots"
    });
  }
  
  return pool;
}

//make a connection during export
module.exports = createPool();