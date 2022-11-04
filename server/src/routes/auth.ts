import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/me', {
    onRequest: [authenticate]
  },
    async (request) => {
    // Retorna informações do usuário logado
    return { user: request.user }
  })

  fastify.post('/users', async (request) => {
    const createUserBody = z.object({
      access_token: z.string()
    })

    const { access_token } = createUserBody.parse(request.body)

    // Fazendo o fetch para a API do Google passando o token de acesso nos headers
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })

    const userData = await userResponse.json()

    // Validação das informações vindas da API do Google
    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    })

    // Validação se os dados de userData batem com as informações de userInfoSchema
    const userInfo = userInfoSchema.parse(userData)

    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id,
      }
    })

    // Se o usuário não existir, este usuário será criado com todos esses os campos
    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          avatarUrl: userInfo.picture,
        }
      })
    }

    const token = fastify.jwt.sign({
      name: user.name,
      avatarUrl: user.avatarUrl,
    }, {
      sub: user.id,
      expiresIn: '7 days', // tempo de expiração do token
    })

    return { token }
  })
}