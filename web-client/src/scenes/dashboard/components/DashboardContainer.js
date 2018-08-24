import React, {Component} from 'react'
import ConversationContainer from './ConversationContainer'
import ThreadList from './ThreadList'

import {withRouter} from 'react-router'
import ApiClient from '../../../services/api/ApiClient'
import Auth from '../../../services/auth'
import {conversation} from "../../../config"

class DashboardContainer extends Component{

    constructor(){
        super()
        this.state = {
            threads: [],
            messages: [],
            activeThread: "",            
            limit: 10,
        }
        this.auth = new Auth()
        this.apiClient = new ApiClient()
        this.loadThreadList = this.loadThreadList.bind(this)
        this.callThreadListApi = this.callThreadListApi.bind(this)
        this.onThreadClick = this.onThreadClick.bind(this)
    }

    componentDidMount()
    {
        this.loadThreadList(this.props.page)   
    }

    onThreadClick(conversation_id)
    {
        let cb = res =>{
            if(res.data){
                let conversations = this.parseResponse(res.data)
                this.setState({ 
                    messages: conversations, 
                    activeThread: conversation_id })
            }
        }
        let url = conversation.threadEndPoint + conversation_id
        this.apiClient.get(url, cb, this.auth.getToken())
    }

    parseResponse(data){
        let conversations=[]
        let n = data.length;
        // run a for loop for all data
            //convert to message object
        for(let k=0; k<n ; k++){
            let item = data[k]    
            if(item.input && item.input.text){
                const userMessage = {
                        senderId: "User",
                        text: item.input ? item.input.text : ''
                    }
                    conversations.push(userMessage)
            }
            if(item.output && item.output.text){
                const serverMessage = {
                    senderId: "Narrafy",
                    text: item.output.text.length>0 ? item.output.text.join(' '): ''
                    }
                conversations.push(serverMessage)
            }
        }
        return conversations
    }

    callThreadListApi(page, cb){
        let offset = page * this.state.limit
        let url = conversation.threadListEndPoint + "?limit="+ 
        this.state.limit + "&offset=" + offset + "&counter=3" +
        "&minMinutes=0" 
        this.apiClient.get(url, cb, this.auth.getToken())
    }

    loadThreadList(page)
    {
        let cb = res =>{
            if(res.data){                  
                this.setState({ 
                    threads: res.data                                                        
                })
                let activeThread = res.data[0].conversation_id
                this.onThreadClick(activeThread)
            }
        }
        this.callThreadListApi(page, cb)
    }

    render(){
        return (
            <div className={"dashboard-container"}>
                <div className={"row"}>
                    <div className="col-md-3  col-md-offset-1">                    
                    <ThreadList 
                        activeThread={this.state.activeThread} 
                        threads={this.state.threads} 
                        onThreadClick={this.onThreadClick}/>
                    </div>
                    <div className="col-md-9">
                        <ConversationContainer messages={this.state.messages} />
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(DashboardContainer)