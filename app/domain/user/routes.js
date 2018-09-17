const User = require('../../domain/user')
const Admin = require('../../domain/admin')
const express = require('express')
const Router  = express.Router()

Router.post('/contact', async (req, res) => {

    let data = {
        email: req.body.email,
        message: req.body.message,
        name: req.body.name
    }

    if(data && data.email){
        await User.contact(data)
        Admin.notify(data.email, "A new message from :" + data.email + "\n Content: " + data.message)
        User.notifyOnContact(data.email, data.name)
        res.json("Thank you for your message. We will get back to you shortly.")
    } else {
        res.sendStatus(500)
    }
})

Router.post('/subscribe', async (req, res) => {

    let email = req.body.email
    if(email){
        await User.subscribe(email)
        Admin.notify(email, "Congrats," + email + " just subscribed!")
        User.notifyOnSubscribe(email)
        res.json("Thank you for joining our newsletter!") 
    } else {
        res.sendStatus(500)
    }
})

module.exports =  Router
