import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'

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

  fastify.post('/pools', async (request, reply) => {
    // Validação com o zod
    const createPoolBody = z.object({
      title: z.string(),
    })

    const { title } = createPoolBody.parse(request.body)

    const generate = new ShortUniqueId({ length: 6 })
    const code = String(generate()).toUpperCase()

    await prisma.pool.create({
      data: {
        title,
        code,
      }
    })

    return reply.status(201).send({ code })
  })

  await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

booststrap()