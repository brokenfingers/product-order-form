import mongoose from 'mongoose'

const ordersSchema = new mongoose.Schema({
    ordered_products: [],
    first_name: String,
    last_name: String,
    address: String,
    city: String,
    post_code: String,
    email: String,
    phone: String,
    pay_method: String,
    shipping_method: String
})

export default mongoose.model('Orders', ordersSchema, 'Orders')