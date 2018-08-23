const Conversation = require('./index')
const Storage = require('../conversation/storage')
const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const Router  = express.Router()
const config = require('../../service/config')
const authMiddleware = passport.authenticate('jwt', { session : false });

// public endpoints
Router.post('/message', async function (req, res) {

    let session_id = req.sessionID;
    let body = req.body;
    let data = {};

    if (body)
    {
        if (body.input){
            data.text = body.input.text
        }

        if (body.context)
        {
            data.context = body.context
            let customer_id = body.context.customer_id
            let decoded = jwt.decode(customer_id);
            if(decoded) {
                data.access_token = decoded.customer.access_token
                data.workspace = decoded.customer.workspace
            } else {
                const {access_token, workspace} = await Conversation.getWorkspace(config.sendGrid.adminEmail)
                data.access_token = access_token
                data.workspace = workspace
            }
        }
    }

    const {conversation} = await Conversation.web(session_id, data)
    res.json(conversation)
})

Router.get('/analytics/count', authMiddleware, async (req, res) =>{

    let total_count = await Storage.getConversationCount()
    res.json(total_count[0])
})

Router.get('/analytics/dataset', authMiddleware, async (req, res) =>{

    let dataSet = await Storage.getConversationDataSet();
    res.json(dataSet)
})

Router.get('/analytics/avg', authMiddleware, async (req, res) =>{
    let avg = await Storage.getAvgStats()
    res.json(avg)
})

Router.get("/thread/list", authMiddleware, async(req, res) =>{
    let limit = req.query["limit"]
    let offset = req.query["offset"]
    let list = await Storage.getThreadList(limit, offset)
    res.json(list)
})

Router.get("/thread/:id", authMiddleware, async(req, res) =>{
    let conversation_id = req.params.id
    let thread = await Storage.getThread(conversation_id)
    res.json(thread)
})

module.exports =  Router
