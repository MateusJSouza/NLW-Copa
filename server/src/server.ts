import Fastify from 'fastify'
import cors from '@fastify/cors'
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'
import { poolRoutes } from './routes/pool'
import { userRoutes } from './routes/user'
import { guessRoutes } from './routes/guess'
import { prisma } from './lib/prisma'
import { authRoutes } from './routes/auth'
import { gameRoutes } from './routes/game'

async function booststrap() {
  const fastify = Fastify({
    // Fastify vai soltando logs de tudo que está acontecendo com a aplicação
    logger: true
  })

  // Permite que qualquer aplicação acesse o nosso back-end
  await fastify.register(cors, {
    origin: true,
  })

  await fastify.register(authRoutes)
  await fastify.register(gameRoutes)
  await fastify.register(guessRoutes)
  await fastify.register(poolRoutes)
  await fastify.register(userRoutes)

  await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

booststrap()