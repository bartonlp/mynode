
function run(gen) {
  var iter;
  iter = gen(function(msg) { iter.next(msg); });
  //console.log(typeof iter);
  //var iter = gen(msg => iter.next(msg));
  iter.next();
}

run(function* (resume) {
  console.log("before");
  // both of the statements below are the same.
  console.log(yield setTimeout(function() { resume( "hello"); }, 1000));
  console.log(yield setTimeout(() => resume( "world"), 1000));
  console.log("after");
});

function *foo(x,y) {
  return x * y;
}

var it = foo( 6, 7 );
console.log(it);
var res = it.next();

console.log(res.value);		// 42
