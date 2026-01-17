import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import type { Application } from 'express'

const options = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Grocery Store API',
         version: '1.0.0',
         description: 'API documentation for Grocery Store Backend',
      },
      servers: [
         {
            url: 'http://localhost:4000',
            description: 'Development server',
         },
      ],
      components: {
         securitySchemes: {
            bearerAuth: {
               type: 'http',
               scheme: 'bearer',
               bearerFormat: 'JWT',
            },
         },
      },
   },
   apis: ['./src/controllers/*.ts', './src/routes/*.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

export const setupSwagger = (app: Application) => {
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
   console.log('📚 Swagger UI available at http://localhost:4000/api-docs')
}
