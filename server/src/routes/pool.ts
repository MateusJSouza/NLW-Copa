import { FastifyInstance } from "fastify"
import ShortUniqueId from "short-unique-id"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function poolRoutes(fastify: FastifyInstance) {
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

    try {
      await request.jwtVerify()

      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          participants: {
            create: {
              userId: request.user.sub
            }
          }
        }
      })
    } catch (err) {
      await prisma.pool.create({
        data: {
          title,
          code,
        }
      })
    }

    return reply.status(201).send({ code })
  })

  // :id -> é esperado uma informação dinâmica
  fastify.post('/pools/join',  {
      onRequest: [authenticate]
    }, async (request, reply) => {
      const joinPoolBody = z.object({
        code: z.string()
      })

      const { code } = joinPoolBody.parse(request.body)

      const pool = await prisma.pool.findUnique({
        where: {
          code,
        },
        // Incluir os dados de participantes 
        include: {
          participants: {
            // Onde o id do participante seja igual ao id do usuário logado
            where: {
              userId: request.user.sub
            }
          }
        }
      })

      // Se não existir um bolão
      if (!pool) {
        return reply.status(404).send({
          message: 'Pool not found.'
        })
      }

      // Se retornar algum dado, quer dizer que o usuário já participa de um bolão
      if (pool.participants.length > 0) {
        return reply.status(400).send({
          message: 'You already joined this pool.'
        })
      }

      if (!pool.ownerId) {
        await prisma.pool.update({
          where: {
            id: pool.id,
          },
          data: {
            ownerId: request.user.sub
          }
        })
      }

      // Criando o usuário passando o id do bolão e o id do usuário logado
      await prisma.participant.create({
        data: {
          poolId: pool.id,
          userId: request.user.sub
        }
      })

      // Criação do novo recurso
      return reply.status(201).send()
  })

  fastify.get('/pools', {
    onRequest: [authenticate]
  }, async (request) => {
    const pools = await prisma.pool.findMany({
      where: {
        participants: {
          some: {
            userId: request.user.sub,
          }
        }
      },
      // Incluindo mais informações na request
      include: {
        // Pegando a quantidade de participantes dentro do bolão
        _count: {
          select: {
            participants: true
          }
        },
        participants: {
          // Selecionando o ID dos participantes e a avatarUrl
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true,
              }
            }
          },
          // Quantos IDs eu quero pegar dos usuários
          take: 4
        },
        owner: {
          // Selecionando o id e o nome do criador do bolão
          select: {
            name: true,
            id: true,
          }
        }
      }
    })

    return { pools }
  })

  fastify.get('/pools/:id', {
    onRequest: [authenticate]
  }, async (request) => {
    const getPoolParams = z.object({
      id: z.string(),
    })

    const { id } = getPoolParams.parse(request.params)

    const pool = await prisma.pool.findUnique({
      where: {
        id,
      },
      // Incluindo mais informações na request
      include: {
        // Pegando a quantidade de participantes dentro do bolão
        _count: {
          select: {
            participants: true
          }
        },
        participants: {
          // Selecionando o ID dos participantes e a avatarUrl
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true,
              }
            }
          },
          // Quantos IDs eu quero pegar dos usuários
          take: 4
        },
        owner: {
          // Selecionando o id e o nome do criador do bolão
          select: {
            name: true,
            id: true,
          }
        }
      }
    })

    return { pool }
  })
}