import express from 'express'
import products from '../models/products.js'
import cors from 'cors'

const Router = express.Router()


Router.use(express.json())
Router.use(express.urlencoded({ extended: false }))
Router.use(cors())

Router.get('/show-products', (req, res) => {
    products.find((err, data) => {
        if (err) return console.log("Nepavyko nuskaityti duomenu bazes")
        res.json(data)
    })

})

export default Router 