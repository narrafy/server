import React, {Component} from 'react'
import {ConversationWrapper, ThreadList } from './components'
import ApiClient from '../../services/api/ApiClient'
import Auth from '../login/services/Auth';
import {conversation} from "../../config"
const auth = new Auth();

export default class Dashboard extends Component{

    constructor(){
        super();
        this.state = {
            threads: [],
            limit: 10,
            offset: 0
        }
        this.apiClient = new ApiClient()
    }

    callApi(data)
    {
        let cb = res =>{
            this.updateState(res.data)
        }
        let url = conversation.threadListEndPoint + "?limit="+ data.limit + "&offset=" + data.offset
        this.apiClient.get(url, cb, auth.getToken())
    }

    updateState(threads)
    {
        this.setState({ threads: [...this.state.threads, threads]})
    }

    componentDidMount()
    {
        const data = {
            limit: this.state.limit,
            offset: this.state.offset
        }
        this.callApi(data)
    }

    render(){
        if(this.state.threads) {
            return (
                <div className={"container"}>
                    <div className={"row"}>
                        <div className="col-md-3  col-md-offset-1">
                            <ThreadList threads={this.state.threads}/>
                        </div>
                        <div className="col-md-9">
                            <ConversationWrapper/>
                        </div>
                    </div>
                </div>
            )
        }else{
            return(<div> "Hello"</div>)
        }
    }
}