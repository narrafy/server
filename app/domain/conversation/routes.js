const Conversation = require('../../domain/conversation')
const express = require('express')
const jwt = require('jsonwebtoken')
const Router  = express.Router()
const config = require('../../service/config')

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

Router.get('/analytics/count', async (req, res) =>{

    let total_count = await Conversation.getConversationCount()
    res.json(total_count[0])
})

Router.get('/analytics/dataset', async (req, res) =>{

    let dataSet = await Conversation.getConversationDataSet();
    res.json(dataSet)
})

Router.get('/analytics/avg', async (req, res) =>{
    let avg = await Conversation.getAvgStats()
    res.json(avg)
})

module.exports =  Router
