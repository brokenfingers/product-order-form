const url = 'http://localhost:3000/'
const productsHolder = document.querySelector('#products-holder')
const headers = { 'Content-Type': 'application/json' }
const messageHolder = document.querySelector('.message-holder')
const formHolder = document.querySelector('#newOrderForm')
let clearBoxes = null;
const allOrderHoler = document.querySelector('#all-orders')
const priceHolder = document.querySelector('.total-price')
// priceHolder.innerHTML = '0.00'
fetch(url + 'products/show-products')
    .then(response => response.json())
    .then(fetchedData => {
        let html = '<ul class="products row row-cols-1 row-cols-md-3 mb-3 text-center">'

        fetchedData.forEach(element => {
            let dataPrice = element.discount_price || element.price
            let price = `<span class="normal-price">${element.price}</span>`
            if (element.discount_price != '') {
                price = `<span class="discount-price">${element.discount_price}</span>
                <span class="old-price">${element.price}</span>`
            }
            html += `<li class="card mb-4 rounded-3 shadow-sm ">
            <div class="product-name card-header py-3">${element.product_name}</div>
             <div class="description list-unstyled mt-3 mb-4">${element.description}</div>
             <div class="price">${price}</div>
             <label for="${element._id}"></label>
             <input class="w-100 btn btn-lg btn-outline-primary" type="checkbox" name="ordered_products" data-price="${dataPrice}" id="${element._id}" value="${element._id}"/>
             </li>`
        })
        html += '</ul>'
        productsHolder.innerHTML = html


        const checkBoxes = document.querySelectorAll('input[type=checkbox]')

        const shipMehodHolder = document.querySelector('#shipping-method')
        let checked = null

        clearBoxes = () => {
            checkBoxes.forEach(itm => itm.checked = false)
            document.querySelectorAll('input[type=text]').forEach(itm => itm.value = '')
            priceHolder.textContent = ''
        }

        checkBoxes.forEach(checkBox => {
            checkBox.addEventListener('change', () => priceHolder.textContent = generatePrice())
        })

        shipMehodHolder.addEventListener('change', () => priceHolder.textContent = generatePrice())


        const generatePrice = () => {
            checked = [...document.querySelectorAll('input[type=checkbox]:checked')].map(itm => parseFloat(itm.getAttribute('data-price')))
            let productPriceSum = checked.reduce((a, b) => a + b)
            let shippingPrice = JSON.parse(shipMehodHolder.value).price

            return checked.length ? parseFloat(productPriceSum + shippingPrice).toFixed(2) : ''
        }
    })



document.querySelector('#newOrderForm').addEventListener('submit', (e) => {
    e.preventDefault()
    messageHolder.innerHTML = ''
    const formData = new FormData(e.target)
    const formObject = Object.fromEntries(formData)
    const checkedProducts = [...document.querySelectorAll('input[type=checkbox]:checked')].map(itm => itm.value)
    formObject.ordered_products = checkedProducts.length ? checkedProducts : ''
    if (formValidator(formObject)) {
        const formJson = JSON.stringify(formObject)
        fetch(url + 'orders/save-order', { method: 'POST', headers, body: formJson })
            .then(resp => resp.json())
            .then(fetched => {

                displayMesssage('success', fetched.message)
                clearBoxes()
            })
    } else {
        displayMesssage('alert', 'Būtina užpildyti visus langelius')
    }
})

const formValidator = objToValue => {
    for (let [key, value] of Object.entries(objToValue))
        if (!value) return false
    return true
}

function displayMesssage(status, message) {
    messageHolder.innerHTML = `<span class="${status}">${message}</span>`
    setTimeout(() => messageHolder.innerHTML = '', 2000)
}

document.querySelector('#show-hide-button').addEventListener('click', (e) => {
    if (e.target.getAttribute('data-content') == e.target.textContent) {
        e.target.textContent = e.target.getAttribute('data-toggle')
        formHolder.classList.toggle('hide')
    } else {
        messageHolder.innerHTML = ''
        e.target.textContent = e.target.getAttribute('data-content')
        formHolder.classList.toggle('hide')
    }
})

document.querySelector('#showall-button').addEventListener('click', (e) => {
    if (e.target.getAttribute('data-content') == e.target.textContent) {
        e.target.textContent = e.target.getAttribute('data-toggle')
        allOrderHoler.classList.toggle('hide')

        fetch(url + 'orders/get-orders')
            .then(response => response.json())
            .then(fetchedOrders => {
                let dataHtml = ''
                fetch(url + 'products/show-products')
                    .then(response => response.json())
                    .then(fetchedProducts => {

                        fetchedOrders.forEach(order => {
                            dataHtml += `<div class="order-card"><div class="personal-info">`
                            dataHtml += `<div>Vardas, pavardė: ${order.first_name} ${order.last_name} </div>`
                            dataHtml += `<div>Adresas: ${order.address} ${order.city}, ${order.post_code}</div>`
                            dataHtml += `<div>Kontakitiniai duomenys: ${order.phone} ${order.email}</div>`
                            dataHtml += `<div>Mokėjimas: ${order.pay_method}    Pristatymas: ${JSON.parse(order.shipping_method).name}</div>`
                            dataHtml += `</div><div class="personal-order">`
                            order.ordered_products.forEach(productOrdered => {
                                fetchedProducts.forEach(productInfo => {
                                    if (productOrdered == productInfo._id) {
                                        dataHtml += `<div class="ordered-product">${productInfo.product_name} <span class="order-price">Kaina: €${parseFloat(productInfo.discount_price || productInfo.price).toFixed(2)}</span></div>`

                                    }
                                })
                            })

                            dataHtml += `</div></div>`

                        })

                        allOrderHoler.innerHTML = dataHtml
                    })
            })


    } else {
        e.target.textContent = e.target.getAttribute('data-content')
        allOrderHoler.classList.toggle('hide')
    }


})