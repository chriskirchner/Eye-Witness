//Session Tools
var rt = require('./rand_tools.js');

//adds the requested suspect to lineup using random ID from 
//max_pool, the maximum profile database size
exports.addSuspectToLineup = function(request, lineup, max_pool){
  request.body['id'] = rt.randID(lineup, max_pool);
  request.session['suspect'] = request.body;
  lineup.push(request.session['suspect']);
};

//adds Lineup (pulled mugshots + suspect) to session for handlebars
exports.addLineupToSession = function(lineup, session){
  session['index'] = 0;
  session['max_index'] = lineup.length;
  session['traits'] = lineup[0];
  session['profiles'] = lineup;
};
