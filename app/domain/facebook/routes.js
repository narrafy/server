const log = require('../../service/log')
const Conversation = require('../../domain/conversation')
const Fb = require('./index')
const Customer = require('../customer/model')

const express = require('express')
const Router  = express.Router()

// public endpoints
Router.get('/webhook', async function (req, res) {

    let verifyToken =  req.query['hub.verify_token'];
    let customer = await Customer.findByToken(verifyToken);
    if (customer && (customer.config.facebook.verify_token === verifyToken)) {

        res.send(req.query['hub.challenge'])
        /* Configure Facebook */
        Fb.init({
            greeting: customer.config.facebook.greeting_message,
            cta: customer.config.facebook.cta,
            access_token: customer.config.facebook.access_token
        }).catch(log.error)
    } else {
        res.send('Invalid verify token!')
    }
})

Router.post('/webhook', async function (req, res) {

    let customer_id = body.context.customer_id;
    let workspace = await Conversation.getWorkspace(customer_id)

    await Conversation.messengerRequest(req.body, workspace)

    res.sendStatus(200)
})

module.exports =  Router
