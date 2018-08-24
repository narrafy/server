import React, {Component} from 'react'
import {ConversationWrapper, ThreadList, ThreadPager } from './components'
import {withRouter} from 'react-router'
import ApiClient from '../../services/api/ApiClient'
import Auth from '../../services/auth'
import {conversation} from "../../config"

class Dashboard extends Component{

    constructor(){
        super();
        this.state = {
            threads: [],
            active_thread: "",
            messages: [],
            limit: 10,
            offset: 0
        }
        this.auth = new Auth();
        this.apiClient = new ApiClient()
        this.loadThreadList = this.loadThreadList.bind(this)
        this.onThreadClick = this.onThreadClick.bind(this)
    }

    loadThreadList(data)
    {
        let cb = res =>{
            if(res.data){ 
                this.setState({ threads: res.data })
                let firstConversationId = res.data[0].conversation_id
                if(firstConversationId){
                    this.onThreadClick(firstConversationId)
                }
            }
        }
        let url = conversation.threadListEndPoint + "?limit="+ data.limit + "&offset=" + data.offset
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

    onThreadClick(conversation_id)
    {
        let cb = res =>{
            if(res.data){
                let conversations = this.parseResponse(res.data)    
                this.setState({ messages: conversations, active_thread: conversation_id })
            }
        }
        let url = conversation.threadEndPoint+conversation_id
        this.apiClient.get(url, cb, this.auth.getToken())
    }

    componentDidMount()
    {
        const data = {
            limit: this.state.limit,
            offset: this.state.offset
        }
        this.loadThreadList(data)
    }

    render(){
        if(this.state.threads) {
            return (
                <div className={"container"}>
                    <div className={"dashboard-container"}>
                        <div className={"row"}>
                            <div className="col-md-3  col-md-offset-1">
                                <ThreadList 
                                active_thread={this.state.active_thread} 
                                threads={this.state.threads} 
                                onThreadClick={this.onThreadClick}/>
                                <ThreadPager />
                            </div>
                            <div className="col-md-9">
                                <ConversationWrapper messages={this.state.messages} sendMessage = {this.callThreadEndPoint} />
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return(<div> "Hello"</div>)
        }
    }
}

export default withRouter(Dashboard)