import { ProductService } from '../../../services/productService'
import { Product } from '../../../models/Product'

// Mock Product model
jest.mock('../../../models/Product')

describe('ProductService', () => {
   beforeEach(() => {
      jest.clearAllMocks()
   })

   describe('getAllProducts', () => {
      it('should return all products', async () => {
         const mockProducts = [
            { _id: '1', name: 'BANANA', price: 100 },
            { _id: '2', name: 'MANGO', price: 200 }
         ]

         // Mock Product.find() - return value that has chaining methods
         const mockQuery = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(mockProducts)
         }

            ; (Product.find as jest.Mock) = jest.fn().mockReturnValue(mockQuery)
            ; (Product.countDocuments as jest.Mock) = jest.fn().mockResolvedValue(2)

         // Call service
         const result = await ProductService.getAllProducts({
            page: 1,
            limit: 10
         })

         // Assert
         expect(result.products).toEqual(mockProducts)
         expect(result.total).toBe(2)
         expect(Product.find).toHaveBeenCalled()
      })
   })

   describe('getProductById', () => {
      it('should return product by id', async () => {
         const mockProduct = { _id: '1', name: 'BANANA', price: 100 }
            ; (Product.findById as jest.Mock) = jest.fn().mockResolvedValue(mockProduct)

         const result = await ProductService.getProductById('1')

         expect(result).toEqual(mockProduct)
         expect(Product.findById).toHaveBeenCalledWith('1')
      })

      it('should throw NotFoundError if product not found', async () => {
         ; (Product.findById as jest.Mock) = jest.fn().mockResolvedValue(null)

         await expect(
            ProductService.getProductById('999')
         ).rejects.toThrow('Product not found')
      })
   })
})