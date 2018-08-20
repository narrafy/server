const User = require('../../domain/user')
const Admin = require('../../domain/admin')

const express = require('express')
const Router  = express.Router()

Router.post('/contact', async (req, res) => {

    let data = {
        email: req.body.email,
        message: req.body.message,
        name: req.body.name
    };
    if(data && data.email){
        await User.contact(data)
        Admin.notify(data.email, "A new message from :" + data.email + "\n Content: " + data.message)
        Admin.notifyUser(data.email, data.name)
        res.sendStatus(200)
    } else {
        res.sendStatus(500)
    }
})

Router.post('/subscribe', async (req, res) => {

    let email = req.body.email
    if(email){
        await User.subscribe(email)
        Admin.notify(email, "Congrats," + email + " just subscribed!")
        Admin.notifySubscriber(email)
        res.sendStatus(200)
    }else {
        res.sendStatus(500)
    }
})

module.exports =  Router
