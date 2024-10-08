import 'dotenv/config'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const PORT = process.env.PORT || 3001

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Pawsome Friend API',
      version: '1.0.0',
      description: 'API documentation for the Pawsome Friend'
    },
    servers: [
      {
        url: 'https://pawsome-friends-server-14r3.onrender.com/'
      }
    ]
  },
  apis: ['openapi.yaml']
}

const specs = swaggerJsdoc(options)

export { specs, swaggerUi }
