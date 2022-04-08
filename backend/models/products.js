import mongoose from 'mongoose'


const Products = new mongoose.Schema({
    product_name: String,
    description: String,
    price: Number,
    discount: Number
})

export default mongoose.model('Products', Products)

