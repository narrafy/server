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
            activeThread: "",
            messages: [],
            limit: 10,
            page: 0
        }
        this.auth = new Auth();
        this.apiClient = new ApiClient()
        this.loadThreadList = this.loadThreadList.bind(this)
        this.onThreadClick = this.onThreadClick.bind(this)
        this.onChangePage = this.onChangePage.bind(this)
        this.callThreadListApi = this.callThreadListApi.bind(this)
    }

    loadThreadList(page)
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
        this.callThreadListApi(page, cb)
    }

    callThreadListApi(page, cb){
        let offset = page * this.state.limit
        let url = conversation.threadListEndPoint + "?limit="+ this.state.limit + "&offset=" + offset
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
                this.setState({ messages: conversations, activeThread: conversation_id })
            }
        }
        let url = conversation.threadEndPoint+conversation_id
        this.apiClient.get(url, cb, this.auth.getToken())
    }

    componentDidMount()
    {
        this.loadThreadList(this.state.page)
    }

    onChangePage(currentPage) {
        // update state with new page of items
        this.callThreadListApi(currentPage - 1)
    }

    render(){
        if(this.state.threads) {
            return (
                <div className={"container"}>
                    <div className={"dashboard-container"}>
                        <div className={"row"}>
                            <div className="col-md-3  col-md-offset-1">
                                <ThreadList 
                                activeThread={this.state.activeThread} 
                                threads={this.state.threads} 
                                onThreadClick={this.onThreadClick}/>
                                <ThreadPager 
                                items={this.state.threads} 
                                onChangePage={this.onChangePage} />
                            </div>
                            <div className="col-md-9">
                                <ConversationWrapper 
                                messages={this.state.messages} 
                                sendMessage = {this.callThreadEndPoint} />
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