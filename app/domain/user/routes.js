const User = require('../../domain/user')
const Admin = require('../../domain/admin')

const express = require('express')
const Router  = express.Router()

Router.post('/contact', async (req, res) => {

    let data = {
        email: req.body.email,
        message: req.body.message,
        name: req.body.name,
        source: "contact form",
        date: new Date()
    };
    await User.contact(data)
    User.notifyAdmin(data)
    Admin.notifyUser(data.email, data.name)
    res.sendStatus(200)
})

Router.post('/subscribe', async (req, res) => {
    let data = {
        email: req.body.email,
        date: new Date(),
    };
    if(data.email){
        await User.subscribe(data)
        User.notifyAdmin({ message: "Congrats," + data.email + " just subscribed!"})
        Admin.notifySubscriber(data.email)
        res.sendStatus(200)
    }
})

module.exports =  Router
