import orders from '../models/orders.js'
import express, { json, Router } from 'express'
import cors from 'cors'

const router = Router()
router.use(json())
router.use(cors())
router.use(express.urlencoded({ extended: false }))

router.post('/save-order', async (req, res) => {
    let newOrder = new orders(req.body)
    newOrder.save()
        .then(rslt => {
            console.log(rslt)
            res.json({ status: 'ok', message: 'Uzsakymas sekmingai priimtas' })
        })
        .catch(err => [
            res.json({ status: 'bad', message: 'Ivyko technine klaida' })
        ])

})

router.get('/get-orders', (req, res) => {
    orders.find((err, result) => {
        if (err) {
            res.json({ status: 'error', message: 'Nepavyko' })
            return
        }
        res.json(result)
        return
    })
})

export default router