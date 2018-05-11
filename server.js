const fastify = require('fastify')()

fastify.get('/', async (request, reply) => {
  console.log("hello");
  return { hello: 'world' }
})

const start = async () => {
  try {
    await fastify.listen(7000)
    console.log("listening on 7000");
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
start()
