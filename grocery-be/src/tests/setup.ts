import mongoose from 'mongoose'

beforeAll(async () => {
   await mongoose.connect('mongodb://localhost:27017/grocery-test')
})

afterAll(async () => {
   await mongoose.connection.dropDatabase()
   await mongoose.connection.close()
})

afterEach(async () => {
   // Clear all collections after each test
   const collections = mongoose.connection.collections
   for (const key in collections) {
      await collections[key].deleteMany({})
   }
})