import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import showRouter from './controllers/products.js'
import orderRouter from './controllers/orders.js'


const app = new express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use('/products', showRouter)
app.use('/orders', orderRouter)




const init = async () => {
    try {
        mongoose.connect('mongodb://localhost/OrderManagement')
        app.listen(3000)
        console.log('Prisijungimas prie duomenu bazes sekmingas')
    } catch (err) {
        console.log(err)
    }
}




init()











