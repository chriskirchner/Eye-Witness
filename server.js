//host the code!
var app = require('./app.js');

app.listen(app.get('port'), function () {
  console.log('App listening at port %s', app.get('port'));
});