const Transcript = require('../../domain/transcript')
const express = require('express')
const Router  = express.Router()


Router.get('/:id', async (req, res) =>{
    let conversationId = req.params.id
    if (conversationId) {
        let tr = Transcript.build(conversationId)
        res.json(tr)
    } else {
        res.sendStatus(500)
    }
})

Router.get('/send',  async (req, res) => {

    var conversation_id = req.query['conversation_id']
    var email = req.query['email']
    if (conversation_id !== null) {
        const transcript = await Transcript.get(conversation_id)
        if(transcript)
            Transcript.send(email, transcript)
        res.sendStatus(200)
    } else {
        res.sendStatus(500)
    }
})

module.exports =  Router
