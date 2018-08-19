const Story = require('../../domain/story')
const express = require('express')
const Router  = express.Router()


// public endpoints
Router.get('/api/story/:id', async function (req, res) {

    let conversationId = req.params.id
    let model = await Story.getModel(conversationId)
    if (model) {
        res.render('profile/user.ejs', model)
    } else {
        res.sendStatus(500)
    }
})

Router.post('/api/story/send', async (req, res) => {

    let data = await Story.save(req.body)
    Story.send(data)
    res.sendStatus(200)
})

Router.post('/api/story/save', async (req, res) => {
    await Story.save(req.body)
    res.sendStatus(200)
})

module.exports =  Router
