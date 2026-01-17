import { Product } from "../models/Product";
import { IProduct, IProductInput, ProductFilters, IProductListResponse } from "../types/product.types";
import { NotFoundError, ValidationError } from "../utils/customErrors";

export class ProductService {

   //Get all products voi filter va paganation
   static async getAllProducts(filters: ProductFilters):
      Promise<IProductListResponse> {
      const {
         page = 1,
         limit = 10,
         category,
         stockStatus,
         search
      } = filters

      const skip = (page - 1) * limit

      //filter object
      const filter: any = { isActive: true }

      //filter category
      if (category) {
         filter.category = category
      }

      //Stock filter
      if (category) {
         filter.category = category
      }

      //Stock status filter
      if (stockStatus === 'out-of-stock') {
         filter.stock = 0
      } else if (stockStatus === 'low-stock') {
         filter.stock = { $gt: 0, $lt: 20 }
      } else if (stockStatus === 'in-stock') {
         filter.stock = { $gte: 20 }
      }

      // Search filter
      if (search) {
         filter.name = { $regex: search, $options: 'i]' }
      }

      //4 Fetch products
      const products = await Product.find(filter)
         .skip(skip)
         .limit(limit)
         .sort({ createdAt: -1 })

      //Count total
      const total = await Product.countDocuments(filter)

      return {
         products,
         pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
         },
      }
   }

   static async getProductById(id: string): Promise<IProduct> {
      const product = await Product.findById(id)
      if (!product) {
         throw new NotFoundError('Product not found')
      }
      return product
   }

   static async createProduct(data: IProductInput): Promise<IProduct> {
      // Validate price
      if (data.price < 0) {
         throw new ValidationError('Giá phải > 0')
      }
      const product = await Product.create(data)
      return product
   }

   static async updateProduct(id: string, data: Partial<IProductInput>): Promise<IProduct> {
      const product = await Product.findByIdAndUpdate(id, data,
         { new: true, runValidators: true }
      )
      if (!product) {
         throw new NotFoundError('Product not found')
      }
      return product
   }

   static async deleteProduct(id: string): Promise<void> {
      const product = await Product.findByIdAndUpdate(
         id,
         { isActive: false },
         { new: true }
      )
      if (!product) {
         throw new NotFoundError('Không tìm thấy sản phẩm')
      }
   }
}