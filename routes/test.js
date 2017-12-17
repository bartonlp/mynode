// node

const query = require("./utilfunctions.test.js").query;
const robots = require("./utilfunctions.test.js").robots;

const res = query("select * from barton.bots where lasttime > current_date() and ip=?", ['192.168.0.6']);

res.then(rows => {
  console.log("here");
  // rows is an array of objects
  for(let row of rows) {
    // 'row' is an object so we use Object.entries() which creates
    // another array.
    for(let [key, value] of Object.entries(row)) {
      console.log("%s: %s", key, value);
    }
  }
}).catch(err => console.log("ERROR:", err.message));

const rob = robots('Node', {headers: {"user-agent": "test it out"}, _remoteAddress: "192.168.0.6"});

//console.log("rob:", rob);

rob.then(d => console.log(d)).catch(err => {
  if(err.statusCode == '404') {
    console.log("404: Not Found");
  } else
    console.log("err", err.message);
});

rob.then(d => console.log(d));

query("select * from barton.bots where lasttime > current_date() and ip=?", ['192.168.0.6'])
.then(rows => {
  console.log("here again");
  // rows is an array of objects
  for(let row of rows) {
    // 'row' is an object so we use Object.entries() which creates
    // another array.
    for(let [key, value] of Object.entries(row)) {
      console.log("%s: %s", key, value);
    }
  }
}).catch(err => console.log("ERROR:", err.message));



