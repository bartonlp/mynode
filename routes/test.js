// node

const query = require("./utilfunctions.test.js").query;
const robots = require("./utilfunctions.test2.js").robots;
/*
const res = query("select * from barton.bots where lasttime > current_date()");

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
*/

const rob = robots('Node', {headers: {"user-agent": "SOMETHING 2"}, _remoteAddress: "192.168.0.6"});

console.log("rob:", rob);

rob.then(d => console.log("then:", d)).catch(err => console.log("TEST ERR:", err));

