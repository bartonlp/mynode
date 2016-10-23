/* test.js */
/* serialize the three domain look ups */
const dns = require('dns');
const step = require('step');

var name = ['bartonlp.com', 'bartonlp.org' ];

function run(gen, iter) {
  (iter = gen((err, data) => (err && iter.throw(err)) || iter.next(data))).next();
}

console.log("name array: ", name);

for(var i=0; i<2; ++i) {
  console.log("name: ", name[i]);
  x(name[i]);

}

function x(n) {
  run(function* (resume) {
    var address = yield dns.lookup(n, resume);
    var mail = yield dns.resolveTxt('mail._domainkey.' + n, resume);
    var txt = yield dns.resolveTxt(n, resume);
    console.log("n: ", n);
    console.log("txt ", txt);
    console.log("address ", address);
    console.log("mail ", mail);
    console.log("");
  });
}