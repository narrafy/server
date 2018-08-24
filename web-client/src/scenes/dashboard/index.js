import React, {Component} from 'react'
import DashboardContainer  from './components/DashboardContainer'
import {withRouter} from 'react-router'
import ApiClient from '../../services/api/ApiClient'
import Auth from '../../services/auth'
import {conversation} from "../../config"

class Dashboard extends Component{

    constructor(){
        super()
        this.state = {
            threads: [],
            messages: [],
            activeThread: "",
            page: 0,
            limit: 10,
        }
        this.auth = new Auth()
        this.apiClient = new ApiClient()
        
        this.onChangePage = this.onChangePage.bind(this)
        this.loadThreadList = this.loadThreadList.bind(this)
        this.onChangePage = this.onChangePage.bind(this)
        this.callThreadListApi = this.callThreadListApi.bind(this)
        this.onThreadClick = this.onThreadClick.bind(this)
    }

    componentDidMount()
    {
        this.loadThreadList(this.state.page)   
    }

    onThreadClick(conversation_id)
    {
        let cb = res =>{
            if(res.data){
                let conversations = this.parseResponse(res.data)
                this.setState({ messages: conversations, 
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
                    threads: res.data,                                     
                    page: page 
                })
                let activeThread = res.data[0].conversation_id
                this.onThreadClick(activeThread)
            }
        }
        this.callThreadListApi(page, cb)
    }

    onChangePage(currentPage){
        this.loadThreadList(currentPage)
    }

    render(){
        return (
                <DashboardContainer 
                    threads={this.state.threads} 
                    messages = {this.state.messages}
                    activeThread = {this.state.activeThread}
                    onThreadClick = {this.onThreadClick}
                    onChangePage = {this.onChangePage} 
                />
        )
    }
}

export default withRouter(Dashboard)