// BLP 2017-03-07 -- This is a nodjs experment. It creates the
// www.bartonlp.org:7000 webpage.

//const count = require('./routes/testasync.js').count;
const query = require('./routes/testasync.js').query;

query("select * from barton.counter limit 10")
.then(function(res) {
  for(ar of res) {
    console.log("%s %s", ar.lasttime, ar.filename);
  }
  process.exit()
})
.catch(function(e) {
  console.log(e);
  process.exit();
});
