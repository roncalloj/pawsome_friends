import { specs, swaggerUi } from '../controllers/swagger.controller.js'

const SwaggerRoutes = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
}

export default SwaggerRoutes
