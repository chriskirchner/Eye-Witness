//random tools

//random range returns random num between inclusive bounds
exports.randRange = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//random ID returns a unique id that is not present in
//list of not_these_ids
exports.randID = function(not_these_ids, max_ids){
  var id;
  var tried_ids = [];
  while (!id){
    if (tried_ids.length != null && tried_ids.length == max_ids){
      return null;
    }
    var id = exports.randRange(1, max_ids);
    for (i=0; i<not_these_ids.length; i++){

      if (id == not_these_ids[i].id){

        var tried = false;
        for(i=0; i<tried_ids.length; i++){
          if (tried_ids[i] == id){
            tried = true;
          }
        }

        if (!tried){
          tried_ids.push(id);
        }

        id = null;

      }
    }
  }
  return id;
};
