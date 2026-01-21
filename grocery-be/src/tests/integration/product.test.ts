import request from 'supertest'
import { app } from '../../app'
import { Product } from '../../models/Product'
import { User } from '../../models/User'

// Skip integration tests for now - need proper test setup
describe.skip('Product API', () => {
   describe('GET /api/products', () => {
      it('should return all products', async () => {
         // TODO: Implement with proper test database setup
      })

      it('should return empty array if no products', async () => {
         // TODO: Implement
      })
   })
})

describe.skip('POST /api/products', () => {
   it('should create product with valid data', async () => {
      // TODO: Implement with proper auth setup
   })

   it('should return 400 with invalid data', async () => {
      // TODO: Implement
   })

   it('should return 401 without token', async () => {
      // TODO: Implement
   })
})
