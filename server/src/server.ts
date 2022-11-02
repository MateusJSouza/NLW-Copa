import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query'],
}) 

async function booststrap() {
  const fastify = Fastify({
    // Fastify vai soltando logs de tudo que está acontecendo com a aplicação
    logger: true
  })

  // Permite que qualquer aplicação acesse o nosso back-end
  await fastify.register(cors, {
    origin: true,
  })

  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()

    return { count }
  })

  await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

booststrap()