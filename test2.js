function asyncThing (value) {
  return new Promise((resolve, reject) => {
    setTimeout(function() { resolve(value); }, 100)
  })
}

async function main () {
  return [1,2,3,4].reduce(async (acc, value) => {
    return await acc + await asyncThing(value)
  }, Promise.resolve(0))
}

main()
.then(v => console.log("OK", v))
.catch(err => console.error("Error", err))
